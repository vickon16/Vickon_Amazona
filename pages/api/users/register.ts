import bcrypt from 'bcryptjs';
import {client} from '../../../utils/client';
import type { NextApiRequest, NextApiResponse } from "next";
import {v4 as uuidv4} from "uuid"
import { singleUserEmailQuery } from '@/utils/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {name, email, password} = req.body;

    const bodyData = {
      name,
      email,
      isAdmin :false,
      password : bcrypt.hashSync(password),
      _type : "user",
      _id : uuidv4()
    };

     try {
      const query = singleUserEmailQuery(email);
      const existUser = await client.fetch(query);

      if (existUser) {
        res.status(401).json("Email already exists");
        return;
      } else {
        const userData = await client.createIfNotExists(bodyData);
        const {_id, _createdAt, _updatedAt, email, isAdmin, name} = userData
        const user = {_id, _createdAt, _updatedAt, email, isAdmin, name};
        res.status(200).json(user)
      }
     } catch (error) {
       res.status(200).json("Failed to create user")
     }
  } else {
    res.status(500).json("bad request");
  }
}
