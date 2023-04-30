import { client } from "@/utils/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const id = req.query.id;

    try {
      // @ts-ignore
       await client.patch(id).set({
        isPaid: true,
        paidAt: new Date().toISOString(),
        "paymentResult.id": req.body.id,
        "paymentResult.status": req.body.email_address,
        "paymentResult.email_address": req.body.id,
      }).commit();

      res.status(200).json({message : "order paid"});
    } catch (error) {
      res.status(500).json("Payment Failed");
    }
  } else {
    res.status(500).json("bad request");
  }
}
