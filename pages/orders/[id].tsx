import {
  Box,
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
import React, { useEffect, useReducer } from "react";
// @ts-ignore
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Error, Layout, Loader } from "../../components";
import { useRouter } from "next/router";
import { API, getError } from "../../utils";
import { useSnackbar } from "notistack";
import {
  paypalInitialState,
  paypalInitialStateType,
  paypalReducer,
} from "@/store/paypalReducer";
import { useStoreContext } from "@/store";
import { urlFor } from "@/utils/image";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

function OrderScreen({ id: orderId }: { id: string }) {
  const { enqueueSnackbar } = useSnackbar();
  const [orderState, dispatch] = useReducer(paypalReducer, paypalInitialState);
  const { loading, error, order, successPay }: paypalInitialStateType =
    orderState;

  const router = useRouter();
  const {
    state: { userInfo },
  } = useStoreContext();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  console.log(order, successPay);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await API.get(`/api/orders/${orderId}`);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!order?._id || successPay || (order?._id && order?._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    }
    else {
      const loadPaypalScript = async () => {
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        // @ts-ignore
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, successPay, paypalDispatch, router, userInfo]);

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order?.totalPrice },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details : any) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await API.put(`/api/orders/${order?._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Order is paid", { variant: "success" });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  }

  function onError(err: any) {
    enqueueSnackbar(getError(err), { variant: "error" });
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h2 className="text-clampBase mb-6 mt-10 font-semibold">
        Order - <span className="font-normal text-clampSm">{orderId}</span>
      </h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <Grid container className="!flex justify-between gap-x-3 gap-y-8 mt-6">
          <Grid item md={8} xs={12} className="!flex !flex-col gap-y-3">
            {/* shipping address card */}
            <div className="flex flex-col bg-primaryCard dark:bg-secondary2 shadow-lg rounded gap-y-4 p-4">
              <h2 className="text-clampMd">Shipping Address</h2>
              <p>
                {order?.shippingAddress?.fullName},{" "}
                {order?.shippingAddress?.address},{" "}
                {order?.shippingAddress?.city},{" "}
                {order?.shippingAddress?.postalCode},{" "}
                {order?.shippingAddress?.country}
              </p>
              <p>
                Status:{" "}
                {order?.isDelivered
                  ? `delivered at ${order?.deliveredAt}`
                  : "not delivered"}
              </p>
            </div>

            {/* payment method card */}
            <div className="flex flex-col bg-primaryCard dark:bg-secondary2 shadow-lg rounded gap-y-4 p-4">
              <h2 className="text-clampMd">Payment Method</h2>
              <p>{order?.paymentMethod}</p>
              <p>
                Status:{" "}
                {order?.isPaid ? `paid at ${order?.paidAt}` : "not paid"}
              </p>
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
                    {order?.orderItems.map((item) => (
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

          {/* summary */}
          <Grid item md={3} xs={12}>
            <div className="!flex !flex-col gap-y-4 bg-bgWhite text-bgDark p-4 rounded shadow-xl">
              <h2 className="text-clampBase mb-2 font-semibold">
                Order Summary
              </h2>
              <div className="flex items-center justify-between w-full text-xl">
                <span>Items:</span>
                <span>${order?.itemsPrice}</span>
              </div>
              <div className="flex items-center justify-between w-full text-xl">
                <span>Tax:</span>
                <span>${order?.taxPrice}</span>
              </div>
              <div className="flex items-center justify-between w-full text-xl">
                <span>Shipping:</span>
                <span>${order?.shippingPrice}</span>
              </div>
              <div className="flex items-center justify-between w-full text-xl border-t-[1px] border-t-gray-500 pt-2">
                <span>Total:</span>
                <span>${order?.totalPrice}</span>
              </div>

              {!order?.isPaid && (
                <div className="flex flex-col gap-y-4">
                  {isPending ? (
                    <Loader />
                  ) : (
                    <Box className="w-full">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </Box>
                  )}
                </div>
              )}

              {order?.isPaid && (
                <Link href="/">
                  <Button
                    variant="contained"
                    className="!bg-primary2 dark:!bg-secondary"
                  >
                    <ArrowBack className="mr-2" />
                    <span>Back to Home</span>
                  </Button>
                </Link>
              )}
            </div>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({
  params: { id },
}: {
  params: { id: string };
}) {
  return { props: { id } };
}

export default OrderScreen;
