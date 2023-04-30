import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { useSnackbar } from "notistack";
import { getError } from "../utils";
import { useStoreContext } from "@/store";
import { API } from "@/utils";
import { urlFor } from "@/utils/image";
import { Loader } from "@/components";
import dynamic from "next/dynamic";

function PlaceOrderScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useStoreContext();
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    // @ts-ignore
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15); // 15%
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    if (!paymentMethod) {
      router.push("/payment");
    }

    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, paymentMethod, router, userInfo]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await API.post("/api/orders", {
        orderItems: cartItems.map((items) => ({
          ...items,
          _key: items._id,
          _id: undefined,
          countInStock: undefined,
          slug: undefined,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: userInfo
      });

      router.push(`/orders/${data?._id}`);

      setTimeout(() => dispatch({ type: "CART_CLEAR" }), 3000);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h2 className="text-clampBase mb-6 mt-10 font-semibold">
        Place Order
      </h2>

      <Grid container className="!flex justify-between gap-x-3 gap-y-8 mt-6">
        <Grid item md={8} xs={12} className="!flex !flex-col gap-y-3">
          {/* shipping address card */}
          <div className="flex flex-col bg-primaryCard dark:bg-secondary2 shadow-lg rounded gap-y-4 p-4">
            <h2 className="text-clampMd">Shipping Address</h2>
            <p>
              {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
              {shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
              {shippingAddress?.country}
            </p>
            <Button
              onClick={() => router.push("/shipping")}
              variant="contained"
              color="success"
              className="w-fit"
            >
              Edit
            </Button>
          </div>

          {/* payment method card */}
          <div className="flex flex-col bg-primaryCard dark:bg-secondary2 shadow-lg rounded gap-y-4 p-4">
            <h2 className="text-clampMd">Payment Method</h2>
            <p>{paymentMethod}</p>
            <Button
              onClick={() => router.push("/payment")}
              variant="contained"
              color="success"
              className="w-fit"
            >
              Edit
            </Button>
          </div>

          {/* order items */}
          <div className="flex flex-col bg-bgWhite dark:bg-secondary2 shadow-lg rounded gap-y-4 p-4 mt-10">
            <h2 className="text-clampMd">Order Items</h2>
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
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <Image
                          src={urlFor(item.image, 50)}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <p className="text-clampSm">{item.name}</p>
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <p className="text-clampSm">{item.quantity}</p>
                      </TableCell>
                      <TableCell className="!text-base dark:text-bgWhite">
                        <p className="text-clampSm">${item.price}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>

        {/*  right section */}
        <Grid item md={3} xs={12}>
          <div className="!flex !flex-col gap-y-4 bg-bgWhite text-bgDark p-4 rounded shadow-lg">
            <h2 className="text-clampBase mb-2 font-semibold">
              Order Summary
            </h2>
            <div className="flex items-center justify-between w-full text-xl">
              <span>Items:</span>
              <span>${itemsPrice}</span>
            </div>
            <div className="flex items-center justify-between w-full text-xl">
              <span>Shipping:</span>
              <span>${shippingPrice}</span>
            </div>
            <div className="flex items-center justify-between w-full text-xl">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
            <Button
              onClick={placeOrderHandler}
              disabled={loading}
              variant="contained"
              fullWidth
              className="!bg-primary2 dark:!bg-secondary"
            >
              Continue
            </Button>


            {loading && (
              <div className="w-full items-center flex justify-center">
                <Loader />
              </div>
            )}

          </div>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
