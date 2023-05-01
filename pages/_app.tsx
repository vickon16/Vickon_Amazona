// @ts-nocheck
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { StoreProvider } from "@/store";
import { SnackbarProvider } from "notistack";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Loader } from "@/components";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const clientSideEmotionCache = createCache({ key: "css" });

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps) {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR)
    return (
      <div className="fixed w-screen h-screen top-0 bottom-0 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <StoreProvider>
          {/*  @ts-ignore */}
          <PayPalScriptProvider deferLoading={true}>
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </StoreProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}
