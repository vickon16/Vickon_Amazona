import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { StoreProvider } from "@/store";
import { SnackbarProvider, useSnackbar } from "notistack";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Loader } from "@/components";
import { API} from "@/utils";

export default function App({ Component, pageProps }: AppProps) {
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
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <StoreProvider>
        {/*  @ts-ignore */}
        <PayPalScriptProvider deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
}
