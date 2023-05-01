import { createClient } from "next-sanity";

export const config = {
  projectId: "g7mcpdu8",
  dataset: "production",
  apiVersion: "2022-03-25",
  useCdn: true,
};

export const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  useCdn: config.useCdn,
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
});
