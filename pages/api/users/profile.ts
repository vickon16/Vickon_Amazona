import bcrypt from "bcryptjs";
import { client } from "../../../utils/client";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {id} = req.query;
    const {name, email, password } = req.body;

    try {
      // @ts-ignore
      const data = await client.patch(id).set({
        name,
        email,
        password : bcrypt.hashSync(password)
      }).commit();

      res.status(200).json(data);
    } catch (error) {
      res.status(401).json("Failed to fetch user, Invalid email or password");
    }
  } else {
    res.status(500).json("bad request");
  }
}
