import { Alert, Button, Grid, MenuItem, Rating, Select } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { client } from "../utils/client";
import { IProductState, ISearchType } from "@/types";
import { API, getError } from "@/utils";
import { Loader, Product } from "@/components";

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const productInitialState = {
  products: [],
  error: "",
  loading: true,
};

const ratings = [1, 2, 3, 4, 5];

export default function SearchScreen() {
  const router = useRouter();
  const {
    category = "all",
    searchQuery = "all",
    price = "all",
    rating = "all",
    sort = "default",
  }: ISearchType = router.query;

  const [{ loading, products, error }, setState] =
    useState<IProductState>(productInitialState);

  const [categories, setCategories] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    };
    fetchCategories();

    const fetchData = async () => {
      let gQuery = '*[_type == "products"';
      if (category !== "all") {
        gQuery += ` && category match "${category}*" `;
      }
      if (searchQuery !== "all") {
        gQuery += ` && name match "${searchQuery}*" || description match "${searchQuery}*" `;
      }
      if (price !== "all") {
        const minPrice = Number(price.split("-")[0]);
        const maxPrice = Number(price.split("-")[1]);
        gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
      }
      if (rating !== "all") {
        gQuery += ` && rating >= ${Number(rating)} `;
      }

      let order = "";
      if (sort !== "default") {
        if (sort === "lowest") order = "| order(price asc)";
        if (sort === "highest") order = "| order(price desc)";
        if (sort === "top-rated") order = "| order(rating desc)";
      }

      gQuery += `] ${order}`;

      try {
        setState(productInitialState);

        const products = await client.fetch(gQuery);
        setState((prev) => ({ ...prev, products }));
      } catch (err) {
        setState((prev) => ({ ...prev, error: getError(err) }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [category, enqueueSnackbar, price, searchQuery, rating, sort]);

  const filterSearch = ({ category, sort, price, rating }: ISearchType) => {
    const path = router.pathname;
    const { query } = router;

    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    router.push({
      pathname: path,
      query: query,
    });
  };

  return (
    <Layout title="search">
      <Grid container className="gap-y-8 !flex justify-between">
        {/* left grid */}
        <Grid
          item
          md={3}
          className="p-2 !flex !flex-col gap-y-3 w-full max-w-[300px] h-fit  md2:!sticky md2:!top-28"
        >
          {/* categories */}
          <div className="w-full flex flex-col gap-y-2">
            <h2 className="text-clampXs font-semibold">Categories</h2>
            <Select
              fullWidth
              value={category}
              className="!text-base dark:text-bgWhite [&_svg]:text-dark dark:[&_svg]:text-bgWhite [&_fieldset]:border-dark dark:[&_fieldset]:border-bgWhite2"
              onChange={(e: any) => filterSearch({ category: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              {categories &&
                categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
            </Select>
          </div>
          {/* prices */}
          <div className="w-full flex flex-col gap-y-2">
            <h2 className="text-clampXs font-semibold">Prices</h2>
            <Select
              value={price}
              className="!text-base dark:text-bgWhite [&_svg]:text-dark dark:[&_svg]:text-bgWhite [&_fieldset]:border-dark dark:[&_fieldset]:border-bgWhite2"
              onChange={(e: any) => filterSearch({ price: e.target.value })}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              {prices.map((price) => (
                <MenuItem key={price.value} value={price.value}>
                  {price.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          {/* ratings */}
          <div className="w-full flex flex-col gap-y-2">
            <h2 className="text-clampXs font-semibold">Ratings</h2>
            <Select
              value={rating}
              className="!text-base dark:text-bgWhite [&_svg]:text-dark dark:[&_svg]:text-bgWhite [&_fieldset]:border-dark dark:[&_fieldset]:border-bgWhite2"
              onChange={(e: any) => filterSearch({ rating: e.target.value })}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              {ratings.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  <Rating value={rating} readOnly />
                  <span>&amp; Up</span>
                </MenuItem>
              ))}
            </Select>
          </div>
          {/* sort */}
          <div className="w-full flex flex-col gap-y-2">
            <h2 className="text-clampXs font-semibold">Sort By</h2>
            <Select
              value={sort}
              className="!text-base dark:text-bgWhite [&_svg]:text-dark dark:[&_svg]:text-bgWhite [&_fieldset]:border-dark dark:[&_fieldset]:border-bgWhite2"
              onChange={(e: any) => filterSearch({ sort: e.target.value })}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="lowest">Price: Low to High</MenuItem>
              <MenuItem value="highest">Price: High to Low</MenuItem>
              <MenuItem value="top-rated">Customer Reviews</MenuItem>
            </Select>
          </div>
        </Grid>

        {/* results grid */}
        <Grid
          item
          md={9}
          xs={12}
          className="p-2 !flex !flex-col gap-y-8 sm:p-4 lg:px-6 w-full"
        >
          <div className=" p-4 bg-primary2 dark:bg-secondary2 rounded flex items-center flex-wrap gap-2">
            {products.length !== 0 ? (
              <span className="bg-emerald-600 text-bgWhite p-2 rounded">
                {products.length} Results
              </span>
            ) : (
              <span className="bg-red-600 text-bgWhite p-2 rounded">
                No Results
              </span>
            )}{" "}
            <span>
              {searchQuery !== "all" && "Search= " + searchQuery}
              {category !== "all" && " , Category=" + category}
              {price !== "all" && " , Price=" + price}
              {rating !== "all" && " , Rating=" + rating + " & up"}
              {searchQuery !== "all" || rating !== "all" || price !== "all" ? (
                <Button
                  variant="outlined"
                  size="small"
                  className="!min-w-0 !border-bgDark dark:!border-white !text-bgDark dark:!text-bgWhite !ml-3"
                  onClick={() => router.push("/search")}
                >
                  X
                </Button>
              ) : null}
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Alert>{error}</Alert>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="flex flex-wrap gap-x-2 gap-y-6 bg-bgWhite dark:bg-secondary2 px-3 py-6 lg:p-8 rounded">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center text-clampBase p-6">
                  No results Found
                </div>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
