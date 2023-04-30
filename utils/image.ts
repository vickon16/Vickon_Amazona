import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

export const urlForThumbnail = (source: { asset: { _ref: string } }, size: number) => {
  return imageUrlBuilder(client).image(source).width(size).height(size).url();
};

export const urlFor = (source: { asset: { _ref: string } }, size : number) => {
  return imageUrlBuilder(client).image(source).width(size).height(size).url();
};
