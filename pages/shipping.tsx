import { Button,TextField} from "@mui/material";
import React, { useEffect } from "react";
import {CheckoutWizard, Layout} from "../components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useStoreContext } from "@/store";
import { IShippingAddress } from "@/types";

export default function ShippingScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = useStoreContext();
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
      return;
    }

    if (!shippingAddress?.address) return;

    setValue("fullName", shippingAddress?.fullName);
    setValue("address", shippingAddress?.address);
    setValue("city", shippingAddress?.city);
    setValue("postalCode", shippingAddress?.postalCode);
    setValue("country", shippingAddress?.country);
  }, [router, setValue, shippingAddress, userInfo]);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: IShippingAddress) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    router.push("/payment");
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1}></CheckoutWizard>

      <form
        /* @ts-ignore */
        onSubmit={handleSubmit(submitHandler)}
        autoComplete="off"
        className="w-full xs:min-w-[550px] lg:w-[550px] mx-auto bg-bgWhite text-bgDark2 px-6 py-8 transform rounded-lg hover:shadow-md transition-transform duration-300 ease-in-out drop-shadow-md mt-14"
      >
        <h2 className="text-clampBase mb-2 font-semibold">
          Shipping Address
        </h2>

        <div className="flex flex-col gap-y-5 mt-6">
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="fullName"
                label="Full Name"
                inputProps={{ type: "fullName", autoComplete: "off" }}
                error={Boolean(errors.fullName)}
                helperText={
                  errors.fullName
                    ? errors.fullName.type === "minLength"
                      ? "Full Name length should be more than 2"
                      : "Full Name is required"
                    : ""
                }
                {...field}
              ></TextField>
            )}
          ></Controller>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="address"
                label="Address"
                inputProps={{ type: "address" }}
                error={Boolean(errors.address)}
                helperText={
                  errors.address
                    ? errors.address.type === "minLength"
                      ? "Address length should be more than 2"
                      : "Address is required"
                    : ""
                }
                {...field}
              ></TextField>
            )}
          ></Controller>
          <Controller
            name="city"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="city"
                label="City"
                inputProps={{ type: "city" }}
                error={Boolean(errors.city)}
                helperText={
                  errors.city
                    ? errors.city.type === "minLength"
                      ? "City length should be more than 2"
                      : "City is required"
                    : ""
                }
                {...field}
              ></TextField>
            )}
          ></Controller>
          <Controller
            name="postalCode"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="postalCode"
                label="Postal Code"
                inputProps={{ type: "postalCode" }}
                error={Boolean(errors.postalCode)}
                helperText={
                  errors.postalCode
                    ? errors.postalCode.type === "minLength"
                      ? "Postal Code length should be more than 2"
                      : "Postal Code is required"
                    : ""
                }
                {...field}
              ></TextField>
            )}
          ></Controller>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="postalCode"
                label="Country"
                inputProps={{ type: "country" }}
                error={Boolean(errors.country)}
                helperText={
                  errors.country
                    ? errors.country.type === "minLength"
                      ? "Country length should be more than 2"
                      : "Country is required"
                    : ""
                }
                {...field}
              ></TextField>
            )}
          ></Controller>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="!bg-primary2 dark:!bg-secondary"
          >
            Continue
          </Button>
        </div>
      </form>
    </Layout>
  );
}
