import React, { memo, useEffect, useState } from "react";
import DarkModeSwitch from "./DarkModeSwitch";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import { useStoreContext } from "@/store";
import { useRouter } from "next/router";
import { formatUserName } from "@/utils";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { FiShoppingCart } from "react-icons/fi";

const listStyles =
  "p-3 text-lg text-bgDark hover:bg-gray-200 cursor-pointer rounded w-full bg-gray-100";

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const bodyStyle = document.body.style;
  const router = useRouter();
  const {
    state: {
      cart: { cartItems },
      userInfo,
    },
    dispatch,
  } = useStoreContext();
  const [isLocked, setIsLocked] = useState(bodyStyle.overflowY === "hidden");

  useEffect(() => {
    bodyStyle.overflowY = isLocked ? "hidden" : "auto";
  }, [isLocked, bodyStyle]);

  const logoutClickHandler = () => {
    setSidebarVisible(true);
    setIsLocked(true);
    dispatch({ type: "USER_LOGOUT" });
    router.push("/");
  };

  const openNavModal = () => {
    setSidebarVisible(true);
    setIsLocked(true);
  };

  const closeNavModal = () => {
    setSidebarVisible(false);
    setIsLocked(false);
  };

  return (
    <header className="w-full max-w-1600 h-[75px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-x-4 bg-primary dark:bg-secondary shadow-md dark:shadow-xl">
      <div>
        <Link href="/" className="text-clampLg font-bold">
          amazona
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <NavbarSearch />
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <span className="hidden xs:block">
          <DarkModeSwitch />
        </span>
        <Link href="/cart">
          <div className="cursor-pointer relative">
            <div className="absolute -top-3 -right-3 w-[20px] h-[20px] rounded-full bg-emerald-600 text-bgWhite flex items-center justify-center">
              {cartItems.length > 0 ? cartItems.length : 2}
            </div>
            <FiShoppingCart className="!text-3xl" />
          </div>
        </Link>
        {userInfo && (
          <Link
            href={`/profile?id=${userInfo?._id}`}
            className="rounded-full bg-primary2 dark:bg-secondary2 p-2 font-bold border border-gray-600 dark:border-gray-200"
          >
            <p>{formatUserName(userInfo?.name)}</p>
          </Link>
        )}

        <span className="cursor-pointer">
          <GiHamburgerMenu onClick={openNavModal} className="!text-3xl" />
        </span>
      </div>

      {/* modal section */}
      <section
        className={`z-[20] ${
          sidebarVisible ? "fixed top-0 left-0 right-0 bottom-0" : ""
        }  bg-black bg-opacity-60 overflow-hidden h-screen`}
        onClick={closeNavModal}
      >
        <aside
          className={`content ${
            sidebarVisible ? "translate-y-0" : "translate-y-[-110%]"
          } z-[24] overflow-hidden p-3 absolute flex transform transition-transform duration-300 ease-in-out top-0 bottom-0 right-0 w-full h-screen max-w-[280px] bg-bgWhite shadow-lg text-black`}
          onClick={(e) => e.stopPropagation()}
        >
          <GiCancel
            aria-label="close"
            onClick={closeNavModal}
            className="absolute top-5 left-3 cursor-pointer !fill-secondary hover:scale-[1.05] !text-2xl"
          />

          <div className="content-body w-full h-full flex mt-20 overflow-y-auto">
            <ul className="flex flex-col gap-y-2 w-full">
              <Link className={listStyles} onClick={closeNavModal} href="/">
                <span>Home</span>
              </Link>
              <Link
                className={listStyles}
                onClick={closeNavModal}
                href="/about-us"
              >
                <span>About</span>
              </Link>
              <Link
                className={listStyles}
                onClick={closeNavModal}
                href="/contact-us"
              >
                <span>Contact Us</span>
              </Link>
              {userInfo && (
                <Link
                  className={listStyles}
                  onClick={closeNavModal}
                  href="/profile"
                >
                  <span>Profile</span>
                </Link>
              )}
              {userInfo && (
                <Link
                  className={listStyles}
                  onClick={closeNavModal}
                  href={`/order-history?id=${userInfo?._id}`}
                >
                  <span>Order History</span>
                </Link>
              )}
              {!userInfo && (
                <Link
                  className={listStyles}
                  onClick={closeNavModal}
                  href="/login"
                >
                  <span>Login</span>
                </Link>
              )}
              {userInfo && (
                <span
                  className={`${listStyles} border-t-[1px] border-t-gray-300`}
                  onClick={logoutClickHandler}
                >
                  <button>Logout</button>
                </span>
              )}
              <span className="mt-6">
                <DarkModeSwitch />
              </span>
            </ul>
          </div>
        </aside>
      </section>
    </header>
  );
};

export default memo(Header);
