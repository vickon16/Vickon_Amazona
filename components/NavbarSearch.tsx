import { useRouter } from 'next/router';
import React, {memo, useState} from 'react'
import {Search} from "@mui/icons-material"

const NavbarSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm) return;
    router.push(`/search?searchQuery=${searchTerm}`)
    setSearchTerm("");
  };

  return (
    <form className="relative hidden sm:flex w-full max-w-[500px] h-full rounded-2xl overflow-hidden items-center" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search accounts and videos"
        className="bg-none h-[38px] sm:h-[45px] bg-gray-100 dark:bg-transparent border-[1px] border-gray-200 dark:border-gray-400 rounded-2xl px-4 text-black w-full outline-gray-300 dark:outline-gray-400 placeholder:text-gray-500 dark:text-white"
        value={searchTerm}
        onChange={(e : {target : {value : string}} ) => setSearchTerm(e.target.value)}
        required
      />

      <button type='submit' disabled={!searchTerm} className='disabled:cursor-not-allowed'>
        <Search className="absolute top-1/2 right-0 transform -translate-y-1/2 text-[23px] fill-gray-600 box-content py-3 px-4 hover:bg-gray-200 dark:hover:bg-opacity-10 border-l-[1px] border-l-gray-300 dark:border-l-gray-500" />
      </button>
    </form>
  );
}

export default memo(NavbarSearch)