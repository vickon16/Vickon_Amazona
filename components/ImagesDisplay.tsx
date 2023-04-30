import React, { useRef, useState } from 'react'
import {ArrowBackIosNew} from "@mui/icons-material";
import {ArrowForwardIos} from "@mui/icons-material";
import { IProduct } from '@/types';
import Image from 'next/image';
import { urlFor } from '@/utils/image';
import Link from 'next/link';

type Props = {
  categoryData : IProduct[];
}

const ImagesDisplay = ({categoryData} : Props) => {
  const [index, setIndex] = useState(0);
  const rowContainer = useRef<HTMLDivElement | null>(null!);

  const scroll = (scrollOffset : number) => {
    if (rowContainer.current) {
      rowContainer.current.scrollLeft += scrollOffset;
    }
  };

  console.log(categoryData)

  return (
    <>
      {categoryData.length > 0 ? (
        <aside className="flex bg-primary dark:bg-secondary2 select-none p-6 rounded-lg shadow-md hover:drop-shadow-md w-full sm:max-w-[550px] flex-col items-center">
          {/* big image container */}
          <Link href={`/products/${categoryData[index].slug.current}`} className=" rounded-xl w-full flex items-center justify-center bg-primaryCard dark:bg-secondaryCard bg-opacity-80">
            <div className="image-container w-[200px] py-4">
              <Image
                src={urlFor(categoryData[index]?.image, 200)}
                className="w-full h-auto object-contain rounded-xl"
                alt="sanity-image"
                width={200}
                height={200}
                placeholder="blur"
                blurDataURL="/assets/blur-image.jpeg"
              />
            </div>
          </Link>

          {/* small image container */}
          <div
            ref={rowContainer}
            className="small-images-container scroll-smooth w-full scrollbar-hide overflow-x-scroll flex gap-3 mt-6 py-4 px-2 scroll"
          >
            {categoryData?.map((category, i) => (
              <article
                className={`small-image ${
                  i === index ? "bg-primaryCard dark:bg-secondary" : ""
                } w-[100px] sm:w-[140px] flex-shrink-0 p-2 rounded-md shadow-md drop-shadow-md hover:scale-[1.05] transition-all ease-in-out duration-200`}
                onMouseEnter={() => setIndex(i)}
                key={category._id}
              >
                <Image
                  src={urlFor(category?.image , 200)}
                  className="w-full h-auto object-contain rounded-md"
                  alt="sanity-image"
                  width={200}
                  height={200}
                  placeholder="blur"
                  blurDataURL="/assets/blur-image.jpeg"
                />
              </article>
            ))}
          </div>
          {/* scroll buttons */}
          <div className="scroll-arrows flex justify-between gap-2 items-center w-[90%] mx-auto">
            <ArrowBackIosNew
              className="cursor-pointer text-clampMd"
              onClick={() => scroll(-180)}
            />
            <ArrowForwardIos
              className="cursor-pointer text-clampMd"
              onClick={() => scroll(180)}
            />
          </div>
        </aside>
      ) : (
        <div>No product with that category.</div>
      )}
    </>
  );
}

export default ImagesDisplay