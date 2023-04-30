import { IProduct } from '@/types';
import React, { useRef } from 'react'
import {Product} from '@/components';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

type Props = {
  title : string;
  allProducts : IProduct[]
}

const ProductsSection = ({allProducts, title} : Props) => {
  const rowContainer = useRef<HTMLDivElement | null>(null!);

  const scroll = (scrollOffset: number) => {
    if (rowContainer.current) {
      rowContainer.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="products-container bg-bgWhite dark:bg-bgDark1 rounded-lg pt-8 pb-6 px-3 sm:px-6 mt-10 shadow-md drop-shadow-md w-full overflow-x-hidden">
      <h2 className="text-clampBase capitalize font-semibold mb-10">
        {title}
      </h2>
      <aside
        className="overflow-x-auto scrollbar-hide scroll-smooth w-full max-w-1200 flex items-center gap-x-6 px-4 shadow-sm"
        ref={rowContainer}
      >
        {allProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </aside>

      {/* scroll buttons */}
      <div className="scroll-arrows flex mt-5 justify-between gap-2 items-center w-full max-w-1200">
        <ArrowBackIosNew
          className="cursor-pointer text-clampMd"
          onClick={() => scroll(-200)}
        />
        <ArrowForwardIos
          className="cursor-pointer text-clampMd"
          onClick={() => scroll(200)}
        />
      </div>
    </div>
  );
}

export default ProductsSection