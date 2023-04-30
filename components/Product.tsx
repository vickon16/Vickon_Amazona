import Link from "next/link";
import { IProduct } from "@/types";
import Image from "next/image";
import { urlFor } from "@/utils/image";
import { Button, Rating } from "@mui/material";
import { useSnackbar } from "notistack";
import { useStoreContext } from "@/store";
import { useRouter } from "next/router";
import { memo } from "react";

type Props = {
  product: IProduct;
};

const Product = ({ product }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useStoreContext();
  const router = useRouter();
  const { _id, name, countInStock, slug, price, image, rating } = product;

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
  };

  return (
    <article className="group">
      <Link
        href={`/products/${slug.current}`}
        className={`product-card bg-primary dark:bg-secondaryCard p-2 flex overflow-hidden w-[130px] h-[150px] rounded-md shadow-md hover:drop-shadow-md transition-shadow ease-in-out duration-300`}
      >
        <Image
          src={urlFor(image, 130)}
          alt="product"
          className="w-full h-auto object-cover group-hover:scale-105 transition-all ease-in-out duration-200"
          width={130}
          height={150}
          placeholder="blur"
          blurDataURL="/assets/blur-image.jpeg"
        />
      </Link>
      <div className="product-body flex flex-col gap-y-2 p-3">
        <p className={`text-clamp2Xs sm:text-clampXs`}>{name}</p>
        <Rating
          className="!text-sm"
          value={rating}
          precision={0.5}
          max={5}
          readOnly
        ></Rating>
        <div className="flex items-center justify-between w-full">
          <p className="product-price text-sm text-emerald-500 font-semibold">
            ${price}
          </p>
          <Button
            variant="outlined"
            size="small"
            className="!text-emerald-500 !border-emerald-600 hover:!border-emerald-300"
            onClick={addToCartHandler}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default memo(Product);
