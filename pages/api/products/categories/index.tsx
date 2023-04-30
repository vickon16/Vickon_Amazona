import { client } from "@/utils/client";
import { getAllCategoriesQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = getAllCategoriesQuery();

    try {
      const data = await client.fetch(query);
      const mappedData = data
        .map((cat: { category: string[] }) => cat.category)
        .reduce((prev: string[], curr: string[]) => prev.concat(curr))
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

// [
//   { category: [ 'Red' ] },
//   { category: [ 'Green' ] },
//   { category: [ 'White' ] },
// ]
