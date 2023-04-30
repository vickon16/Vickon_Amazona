import { client } from "@/utils/client";
import { getAllUserOrder} from "@/utils/queries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const query = getAllUserOrder(id);

    try {
      const order = await client.fetch(query);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json("Failed to fetch user order");
    }
  } else {
    res.status(500).json("bad request");
  }
}
