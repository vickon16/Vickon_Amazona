import { IFormInputs } from "@/types";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useForm, Controller } from "react-hook-form";

type Props = {
  redirect? : string;
  submitHandler: (items: IFormInputs) => void;
};

const FormLogin = ({ submitHandler, redirect }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      autoComplete="off"
      className="w-full xs:min-w-[550px] lg:w-[550px] mx-auto bg-bgWhite text-bgDark2 px-6 py-8 transform rounded-lg hover:shadow-md transition-transform duration-300 ease-in-out drop-shadow-md"
    >
      <h2 className="text-clampBase mb-2 font-semibold text-primary dark:text-secondary">
        Login
      </h2>

      <div className="flex flex-col gap-y-5 mt-6">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // pattern for checking validity of email
          }}
          render={({ field }) => (
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{
                type: "email",
                autoComplete: "off",
              }}
              error={Boolean(errors.email)}
              helperText={
                errors.email
                  ? errors.email.type === "pattern"
                    ? "Email is not valid"
                    : "Email is required"
                  : ""
              }
              {...field}
            ></TextField>
          )}
        ></Controller>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            minLength: 6,
          }}
          render={({ field }) => (
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: "password", autoComplete: "new-password" }}
              error={Boolean(errors.password)}
              helperText={
                errors.password
                  ? errors.password.type === "minLength"
                    ? "Password length should be more than 5"
                    : "Password is required"
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
          className="!bg-primary dark:!bg-secondary"
        >
          Login
        </Button>
        <p className="text-gray-500">
          Do not have an account?{" "}
          <Link
            href={`${
              redirect ? `/register?redirect=${redirect}` : "/register"
            }`}
            className="text-primary dark:text-secondary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default FormLogin;
