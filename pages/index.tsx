import {
  FormLogin,
  Layout,
  Loader,
  ProductsSection,
  ImagesDisplay,
} from "@/components";
import { useStoreContext } from "@/store";
import { IFormInputs, IProduct } from "@/types";
import { API, getError } from "@/utils";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

type Props = {
  categoryData: IProduct[];
  brandData: IProduct[];
  allProductsData: IProduct[];
  categories: string[];
  brands: string[];
};

export default function Home({
  categoryData,
  brandData,
  allProductsData,
  categories,
  brands,
}: Props) {
  const [loading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const {state: { userInfo },dispatch} = useStoreContext();
  const router = useRouter();

  const { category = "White", brand = "Nike" } = router.query;

  const submitHandler = async ({ email, password }: IFormInputs) => {
    try {
      const { data } = await API.post("/api/users/login", {
        email,
        password,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      router.push("/");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const filterChangeEvents = ({
    category,
    brand,
  }: {
    category?: string;
    brand?: string;
  }) => {
    const path = router.pathname;
    const { query } = router;

    if (category) query.category = category;
    if (brand) query.brand = brand;

    router.push({
      pathname: path,
      query: query,
    });
  };

  useEffect(() => {
    dispatch({ type: "PRODUCT_ADD_ITEM", payload: allProductsData });
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [allProductsData, dispatch]);

  return (
    <Layout>
      <section
        id="home"
        className="sm:px-4 flex justify-between w-full gap-2 flex-wrap"
      >
        <div className="self-start w-full sm:w-[400px]">
          <h1 className="text-clamp3Xl">
            <span className="text-emerald-600">30%</span> OFF
          </h1>
          <article className="text-clampXl">Super Season</article>

          <div className="capitalize bg-primary2 dark:bg-secondary2 shadow-md w-full max-w-[400px] rounded p-6 mt-6 flex flex-col gap-y-4">
            <h1 className="font-semibold text-clampSm">
              Keep the Summer Vibe Alive
            </h1>

            <article className="text-clampXs">
              Save up to 30% off on shirts and accessories for everyone on your
              list. <br />
              <br />
              Over 10000+ accessories sold to date.
            </article>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Explore our new arrivals
            </p>

            <Link href="/search">
              <Button
                variant="outlined"
                className=" !text-bgDark dark:!text-bgWhite !border-bgDark dark:!border-bgWhite"
              >
                Explore
              </Button>
            </Link>
          </div>
        </div>

        {/* image section */}
        <div
          className="max-w-[420px] min-w-[300px] flex flex-col justify-center flex-1 h-auto mr-auto my-6 lg:mt-24"
          style={{ transform: "rotateY(-40deg) rotateZ(-2deg)" }}
        >
          <Image
            src={"/assets/shirts/blue5.png"}
            alt="home-image"
            width={480}
            height={480}
            className="w-full h-auto object-cover rounded-md"
            priority
            placeholder="blur"
            blurDataURL="/assets/blur-image.jpeg"
          />
        </div>

        {/* form section */}
        <div className="w-full flex-1 lg:mt-10">
          {!userInfo ? (
            <FormLogin submitHandler={submitHandler} />
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <ImagesDisplay categoryData={categoryData} />
            </div>
          )}
        </div>
      </section>

      {/* all products section */}
      {loading ? (
        <div className="w-full h-full flex items-center">
          <Loader />
        </div>
      ) : (
        <section className="flex flex-col gap-y-4 w-full mb-8">
          <ProductsSection title="New Products" allProducts={allProductsData} />
        </section>
      )}

      {/* categories section */}
      {loading ? (
        <div className="w-full h-full flex items-center">
          <Loader />
        </div>
      ) : (
        <section className="mt-10">
          <div className="flex items-center gap-x-3">
            <label className="text-md sm:text-lg font-semibold mr-2">
              Select Category :{" "}
            </label>
            <select
              value={category}
              onChange={(e: any) =>
                filterChangeEvents({ category: e.target.value })
              }
              className="px-3 py-2 text-md sm:text-lg bg-primary2 dark:bg-secondary2 shadow-lg hover:opacity-80 cursor-pointer rounded-md outline-none border-0"
            >
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <option key={cat + i} value={cat}>
                    {cat}
                  </option>
                ))
              ) : (
                <div>No category Available</div>
              )}
            </select>
          </div>

          <ProductsSection
            title={`Category - ${category}`}
            allProducts={categoryData}
          />
        </section>
      )}

      {/* brand section */}
      {loading ? (
        <div className="w-full h-full flex items-center">
          <Loader />
        </div>
      ) : (
        <section className="mt-10">
          <div className="flex items-center gap-x-3">
            <label className="text-md sm:text-lg font-semibold mr-2">
              Select Brand :{" "}
            </label>
            <select
              value={brand}
              onChange={(e: any) =>
                filterChangeEvents({ brand: e.target.value })
              }
              className="px-3 py-2 text-md sm:text-lg bg-primary2 dark:bg-secondary2 shadow-lg hover:opacity-80 cursor-pointer rounded-md outline-none border-0"
            >
              {brands.length > 0 ? (
                brands.map((brand, i) => (
                  <option key={brand + i} value={brand}>
                    {brand}
                  </option>
                ))
              ) : (
                <div>No Brand Available</div>
              )}
            </select>
          </div>

          <ProductsSection title={`Brand - ${brand}`} allProducts={brandData} />
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps = async ({ query }: any) => {
  const { category, brand } = query;

  const results = await Promise.allSettled([
    API.get(`/api/products`).catch((e) => e),
    API.get(`/api/products/categories/${category || "White"}`).catch((e) => e),
    API.get(`/api/products/categories`).catch((e) => e),
    API.get(`/api/products/brands/${brand || "Nike"}`).catch((e) => e),
    API.get(`/api/products/brands`),
  ]);

  const fulfilledResults = results
    .filter((result) => result.status === "fulfilled")
    // @ts-ignore
    .map((result) => result.value.data);

  const [allProductsData, categoryData, categories, brandData, brands] =
    fulfilledResults;

  return {
    props: {
      categoryData: categoryData.slice(0, 20),
      brandData: brandData.slice(0, 20),
      allProductsData: allProductsData.slice(0, 20),
      categories,
      brands,
    },
  };
};
