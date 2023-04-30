import { Layout } from "@/components";
import { IProduct } from "@/types";
import { API } from "@/utils";
import { urlFor } from "@/utils/image";
import { useStoreContext } from "@/store";
import { Button, Grid, Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import { ArrowBack } from "@mui/icons-material";
import dynamic from "next/dynamic";

const ProductScreen = ({ product }: { product: IProduct }) => {
  const {
    _id,
    brand,
    category,
    countInStock,
    description,
    image,
    name,
    price,
    numReviews,
    rating,
    slug,
  } = product;
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useStoreContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const addToCartHandler = () => {
    const existItem = cartItems.find((items) => items._id === product?._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (quantity > product?.countInStock) {
      enqueueSnackbar("Sorry, Product is out of stock", { variant: "error" });
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { _id, name, countInStock, slug, price, image, quantity },
    });

    enqueueSnackbar(`${product.name} is added to the cart`, {
      variant: "success",
    });

    router.push("/cart");
  };

  return (
    <Layout title={name}>
      {product ? (
        <div>
          <Link href="/" className="flex items-center mt-4 mb-8 w-fit">
            <span>
              <ArrowBack />
            </span>
            <span className="ml-1">Back to Products</span>
          </Link>

          {/* image grid */}
          <Grid container gap={3}>
            <Grid
              item
              md={4}
              xs={12}
              className="bg-primary2 dark:bg-secondary2 rounded-md shadow-md hover:drop-shadow-md flex justify-center"
            >
              <div className="bg-primaryCard dark:bg-secondary bg-opacity-80 w-[300px] p-6 ">
                <Image
                  src={urlFor(image, 300)}
                  alt="Product-image"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            </Grid>

            {/* description grid */}
            <Grid item md={5} xs={12} className="p-2 !flex !flex-col gap-y-3">
              <h1 className="text-clampLg dark:text-bgWhite">{name}</h1>
              <p className="text-bgDark3 dark:text-bgWhite1">
                Category :{" "}
                <span className=" dark:text-bgWhite text-bgDark1 text-lg">
                  {category} Shirt
                </span>
              </p>
              <p className="text-bgDark3 dark:text-bgWhite1">
                Brand :{" "}
                <span className=" dark:text-bgWhite text-bgDark1 text-lg">
                  {brand}
                </span>
              </p>

              <Rating value={rating} precision={0.5} max={5} readOnly></Rating>
              <p className="text-bgDark3 dark:text-bgWhite1">
                Reviews :{" "}
                <span className=" dark:text-bgWhite text-bgDark1 text-lg">
                  {numReviews}
                </span>
              </p>

              <p className="text-bgDark3 dark:text-bgWhite1">
                Available (in stock) :{" "}
                <span className=" dark:text-bgWhite text-bgDark1 text-lg">
                  {countInStock} qty
                </span>
              </p>

              <p className="text-bgDark3 dark:text-bgWhite1">
                Description :{" "}
                <span className="tracking-wide dark:text-bgWhite text-bgDark1 text-lg">
                  {description}
                </span>
              </p>
            </Grid>

            {/* display total */}
            <Grid
              item
              md={2}
              xs={12}
              className="p-4 !flex !flex-col gap-y-5 bg-bgWhite text-bgDark !max-w-[350px] !min-w-[250px] shadow-lg hover:drop-shadow-lg rounded-md mt-6 self-start"
            >
              <p className="flex items-center justify-between w-full px-4">
                <span>Price</span>
                <span>${price}</span>
              </p>
              <p className="flex items-center justify-between w-full px-4">
                <span>Status</span>
                <span>{countInStock > 0 ? "In stock" : "Unavailable"}</span>
              </p>
              <Button onClick={addToCartHandler} fullWidth variant="contained">
                Add to cart
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : null}
    </Layout>
  );
};


export const getServerSideProps = async (context: any) => {
  const {data} = await API.get(`/api/products/${context.params?.slug}`);

  return {
    props: { product: data },
  };
};

export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });