import { client } from "@/utils/client";
import { getByCategoryQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const {category} = req.query;
    const query = getByCategoryQuery(category);

    try {
      const data = await client.fetch(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(`Failed to fetch product`)
    }
  } else {
    res.status(500).json("Bad Request");
  }
}
