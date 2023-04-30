import {client} from '@/utils/client';
import { getOrderById } from '@/utils/queries';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const query = getOrderById(id);
    const order = await client.fetch(query);
    res.status(200).json(order);
  } else {
    res.status(500).json("bad request");
  }
}
