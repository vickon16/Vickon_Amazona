import React, { memo } from 'react'

const Footer = () => {
  return (
    <footer className='flex flex-col gap-y-3 items-center py-10'>
      <p className="text-2xl font-bold py-2">
        amazona
      </p>
      <p className='text-gray-400'>
        Vickon | Amazona
      </p>
      <p className="text-xs">
       &#169; All rights reserved
      </p>
    </footer>
  );
}

export default memo(Footer)