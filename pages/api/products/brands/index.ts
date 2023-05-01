import { client } from "@/utils/client";
import { getAllBrandQuery, getAllCategoriesQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = getAllBrandQuery();

    try {
      const data = await client.fetch(query);
      const mappedData = data
        .map((data: { brand: string }) => data.brand)
        .filter(
          (cat: string, index: number, self: string[]) =>
            self.indexOf(cat) === index
        );
      res.status(200).json(mappedData);
    } catch (error) {
      res.status(500).json(`Failed to fetch all Categories`);
    }
  } else {
    res.status(500).json("Bad Request");
  }
}
