import { client } from "@/utils/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user } = req.body;
    const orderDoc = {
      ...req.body,
      _type: "order",
      createdAt: new Date().toISOString(),
      userName: user?.name,
      user: {
        _type: "reference",
        _ref: user._id,
      },
    };

    if (!user) {
      res.status(401).json("User does not exist");
      return;
    }

    try {
      const order = await client.create(orderDoc);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json("Failed to create order");
    }
  } else {
    res.status(500).json("bad request");
  }
}
