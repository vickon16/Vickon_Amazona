import { client } from "@/utils/client";
import { productDetailQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const {slug} = req.query;

    try {
      const query = productDetailQuery(slug);
      const products = await client.fetch(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(`Failed to fetch single product`);
    }
  } else {
    res.status(500).json("Bad Request");
  }
}
