import {Layout} from "@/components";
import { useStoreContext } from "@/store";
import React from "react";
import {
  Grid,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IProduct } from "@/types";
import { useSnackbar } from "notistack";
import { ArrowBack } from "@mui/icons-material";
import { urlFor } from "@/utils/image";
import dynamic from "next/dynamic";

const Cart = () => {
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useStoreContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const updateCartHandler = (item: IProduct, value: number) => {
    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        quantity: value,
      },
    });

    enqueueSnackbar(`${item?.name} is updated in the cart`, {
      variant: "success",
    });
  };

  const removeItemHandler = (item: IProduct) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="text-clampXl my-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="flex flex-col gap-y-3 text-clampSm text-bgDark bg-bgWhite p-4 rounded w-full max-w-[400px] mx-auto justify-center items-center min-h-[200px] shadow-md">
          <p className="text-clampMd">Cart is empty.</p>
          <Link href="/">
            <Button
              variant="contained"
              className="!bg-primary2 dark:!bg-secondary"
            >
              <ArrowBack className="mr-2" />
              <span>Go Shopping</span>
            </Button>
          </Link>
        </div>
      ) : (
        <Grid container className="justify-between !gap-x-4 !gap-y-12">
          <Grid item md={8} xs={12}>
            <TableContainer className="scrollbar-hide">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!text-base dark:text-bgWhite">
                      Image
                    </TableCell>
                    <TableCell className="!text-base dark:text-bgWhite">
                      Name
                    </TableCell>
                    <TableCell className="!text-base dark:text-bgWhite">
                      Quantity
                    </TableCell>
                    <TableCell className="!text-base dark:text-bgWhite">
                      Price
                    </TableCell>
                    <TableCell className="!text-base dark:text-bgWhite">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <Link href={`/products/${item.slug.current}`}>
                          <Image
                            src={urlFor(item.image, 50)}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        </Link>
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <p className="text-clampSm">{item.name}</p>
                      </TableCell>
                      <TableCell>
                        <Select
                          className="!text-base dark:text-bgWhite [&_svg]:text-dark dark:[&_svg]:text-bgWhite [&_fieldset]:border-dark dark:[&_fieldset]:border-bgWhite2"
                          value={item.quantity}
                          onChange={(event: any) =>
                            updateCartHandler(item, event.target.value)
                          }
                        >
                          {Array(item.countInStock)
                            .fill(0)
                            .map((_, i) => (
                              <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            ))}
                        </Select>
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <p className="text-clampSm">${item.price}</p>
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <Button
                          variant="contained"
                          className="!bg-red-500"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            className="p-4 py-6 !flex !flex-col gap-y-6 bg-bgWhite text-bgDark !max-w-[350px] !min-w-[250px] shadow-lg hover:drop-shadow-lg rounded-md mt-6 self-start"
          >
            <p className="flex items-center justify-between w-full px-4">
              <span className="text-clampSm">
                {/* @ts-ignore */}
                Subtotal : ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                items) :
              </span>
              <span className="text-clampSm">
                {/* @ts-ignore */}${" "}
                {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
              </span>
            </p>
            <Button
              onClick={() => {
                router.push("/shipping");
              }}
              fullWidth
              variant="contained"
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
