import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { RemoveShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Layout, Error, Loader } from "../components";
import { useStoreContext } from "@/store";
import { API, formatDateAgo, getError } from "@/utils";
import { IOrder } from "@/types";
import Link from "next/link";

function OrderHistoryScreen({ orders }: { orders: IOrder[] }) {
  const {
    state: { userInfo },
  } = useStoreContext();

  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, [router, userInfo]);

  return (
    <Layout title="Order History">
      <h1 className="text-clampXl my-6 text-bgWhite">Order History</h1>

      {orders.length > 0 ? (
        <TableContainer className="scrollbar-hide">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="!text-base dark:text-bgWhite">
                  ID
                </TableCell>
                <TableCell className="!text-base dark:text-bgWhite">
                  DATE
                </TableCell>
                <TableCell className="!text-base dark:text-bgWhite">
                  TOTAL
                </TableCell>
                <TableCell className="!text-base dark:text-bgWhite">
                  PAID
                </TableCell>
                <TableCell className="!text-base dark:text-bgWhite">
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className=" dark:text-bgWhite whitespace-nowrap">
                    {order._id}
                  </TableCell>
                  <TableCell className="dark:text-bgWhite whitespace-nowrap">
                    {formatDateAgo(order._createdAt)}
                  </TableCell>
                  <TableCell className=" dark:text-bgWhite whitespace-nowrap">
                    ${order.totalPrice}
                  </TableCell>
                  <TableCell className=" dark:text-bgWhite whitespace-nowrap">
                    {order.isPaid ? (
                      <>paid at {formatDateAgo(order.paidAt)}</>
                    ) : (
                      <>not paid</>
                    )}
                  </TableCell>
                  <TableCell className="dark:text-bgWhite">
                    <Link href={`/orders/${order._id}`}>
                      <Button
                        variant="contained"
                        size="small"
                        className="!bg-red-500"
                      >
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="text-clampMd flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-y-4">
            <RemoveShoppingCart fontSize="large" />
            No Order to display
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = async ({
  query: { id },
}: {
  query: { id: string };
}) => {
  const { data } = await API.get(`/api/orders/history?id=${id}`);

  return {
    props: {
      orders: data,
    },
  };
};

export default OrderHistoryScreen;
