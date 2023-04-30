import {
  Error,
  FormLogin,
  Layout,
  Loader,
  ProductsSection,
  ImagesDisplay,
} from "@/components";
import { useStoreContext } from "@/store";
import { IFormInputs, IProduct } from "@/types";
import { API, getError } from "@/utils";
import { urlForThumbnail } from "@/utils/image";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function Home() {
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState("White");
  const [categoriesArr, setCategoriesArr] = useState([]);
  const [categoryData, setCategoryData] = useState<IProduct[] | []>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setIsError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: { userInfo, allProducts },
    dispatch,
  } = useStoreContext();
  const router = useRouter();

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

  useEffect(() => {
    if (allProducts.length === 0) return;

    const timer = setInterval(() => {
      const random = Math.round(Math.random() * allProducts.length - 1);
      setIndex(random);
    }, 120000);

    return () => clearInterval(timer);
  }, [allProducts.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/api/products`);
        const { data: catData } = await API.get(
          `/api/products/categories/${category}`
        );
        const { data: allCategories } = await API.get(
          `/api/products/categories`
        );
        dispatch({ type: "PRODUCT_ADD_ITEM", payload: data.slice(0, 20) });
        setCategoryData(catData);
        setCategoriesArr(allCategories);
      } catch (err: any) {
        setIsError(getError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category, dispatch, userInfo]);

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
            <p className="text-sm text-gray-700 dark:text-gray-300">Explore our new arrivals</p>

            <Link href="/search">
              <Button variant="outlined" className=" !text-bgDark dark:!text-bgWhite !border-bgDark dark:!border-bgWhite">
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
            src={
              index !== 0 && allProducts.length > 0
                ? urlForThumbnail(allProducts[index]?.image, 480)
                : "/assets/shirts/blue5.png"
            }
            alt="home-image"
            width={480}
            height={480}
            className="w-full h-auto object-cover"
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
          ) : error ? (
            <Error error={error} />
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
      ) : error ? (
        <Error error={error} />
      ) : (
        <section className="flex flex-col gap-y-4 w-full mb-8">
          <ProductsSection title="New Products" allProducts={allProducts} />
        </section>
      )}

      {/* categories section */}
      {loading ? (
        <div className="w-full h-full flex items-center">
          <Loader />
        </div>
      ) : error ? (
        <Error error={error} />
      ) : (
        <section className="mt-10">
          <div className="flex items-center gap-x-3">
            <label className="text-md sm:text-lg font-semibold mr-2">
              Select Category :{" "}
            </label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="px-3 py-2 text-md sm:text-lg bg-primary2 dark:bg-secondary2 shadow-lg hover:opacity-80 cursor-pointer rounded-md outline-none border-0"
            >
              {categoriesArr.length > 0 ? (
                categoriesArr.map((cat, i) => (
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
    </Layout>
  );
}
