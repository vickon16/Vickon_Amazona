import bcrypt from "bcryptjs";
import { client } from "../../../utils/client";

import type { NextApiRequest, NextApiResponse } from "next";
import { singleUserEmailQuery } from "@/utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {email, password} = req.body;
    const query = singleUserEmailQuery(email);

    try {
       const sanityUserData = await client.fetch(query);

      if (sanityUserData && sanityUserData.email === email && bcrypt.compareSync(password, sanityUserData.password)) {
        const { _id, _createdAt, _updatedAt, email, isAdmin, name } = sanityUserData;
        const user = { _id, _createdAt, _updatedAt, email, isAdmin, name };
        res.status(200).json(user);
      } else {
        res.status(401).json("Invalid email or password");
      }
    } catch (error) {
      res.status(401).json("Failed to fetch user, Invalid email or password");
    }
   

  } else {
    res.status(500).json("bad request");
  }
}
