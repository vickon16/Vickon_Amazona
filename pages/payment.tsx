import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { CheckoutWizard, Layout } from "../components";
import { useStoreContext } from "@/store";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

function PaymentScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { state : {cart : {shippingAddress}, userInfo}, dispatch } = useStoreContext();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login")
      return;
    }

    if (!shippingAddress?.address) {
      router.push("/shipping");
      return;
    }
      
    setPaymentMethod(Cookies.get("paymentMethod") || "");
  }, [router, shippingAddress, userInfo]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
      return;
    } 
      
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
    router.push("/placeorder");
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form
        onSubmit={submitHandler}
        className="w-full xs:min-w-[550px] lg:w-[550px] mx-auto bg-bgWhite text-bgDark2 px-6 py-8 transform rounded-lg hover:shadow-md transition-transform duration-300 ease-in-out drop-shadow-md mt-14"
      >
        <h2 className="text-clampBase mb-2 font-semibold">
          Payment Method
        </h2>

        <div className="flex flex-col gap-y-4">
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Payment Method"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                label="PayPal"
                value="PayPal"
                control={<Radio />}
              ></FormControlLabel>
              <FormControlLabel
                label="Stripe"
                value="Stripe"
                control={<Radio />}
              ></FormControlLabel>
              <FormControlLabel
                label="Cash"
                value="Cash"
                control={<Radio />}
              ></FormControlLabel>
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="!bg-primary2 dark:!bg-secondary"
          >
            Continue
          </Button>
          <Button
            variant="outlined"
            type="button"
            fullWidth
            onClick={() => router.push("/shipping")}
            className="!border-primary2 !text-primary2 dark:!border-secondary dark:!text-secondary"
          >
            Back
          </Button>
        </div>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PaymentScreen), { ssr: false });
