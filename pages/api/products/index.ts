// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "@/utils/client";
import { allProductQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "GET") {
    try {
      const query = allProductQuery();
      const products = await client.fetch(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Failed to fetch products")
    }
  } else {
    res.status(500).json("Bad Request");
  }
}
