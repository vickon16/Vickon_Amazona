import { Button, TextField} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {Layout} from "../components";
import { API, formatDateAgo, getError } from "@/utils";
import { useStoreContext } from "@/store";
import { IFormInputs } from "@/types";

function ProfileScreen() {
  const router = useRouter();
  const {
    state: { userInfo },
    dispatch,
  } = useStoreContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    setValue("name", userInfo.name);
    setValue("email", userInfo.email);
  }, [router, setValue, userInfo]);

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: IFormInputs) => {

    if (!userInfo) return;

    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }

    try {
      const { data } = await API.put(`/api/users/profile?id=${userInfo?._id}`,
        {
          name,
          email,
          password,
        },
      );

      dispatch({ type: "USER_LOGIN", payload: data });
      router.push("/");
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  console.log(userInfo?._createdAt)


  return (
    <Layout title="Profile">
      <p className="text-clampLg font-semibold mb-6">Profile</p>

      <section className="flex items-start justify-between w-full flex-wrap gap-x-3 gap-y-10">
        <div className="flex flex-col gap-y-4 px-2 sm:px-6 py-10  bg-primary2 dark:bg-secondary2 rounded-md shadow-md overflow-hidden">
          <p className="text-sm sm:text-clampSm  flex items-center gap-x-3">
            <span className="text-gray-700 dark:text-gray-300">Name : </span>
            <span>{userInfo?.name}</span>
          </p>
          <p className="text-sm sm:text-clampSm  flex items-center gap-x-3 truncate w-full">
            <span className="text-gray-700 dark:text-gray-300">Email : </span>
            <span>{userInfo?.email}</span>
          </p>
          <p className="text-sm sm:text-clampSm  flex items-center gap-x-3">
            <span className="text-gray-700 dark:text-gray-300">CreatedAt : </span>
            <span>
              {formatDateAgo(userInfo?._createdAt)}
            </span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          autoComplete="off"
          className="w-full xs:min-w-[550px] lg:w-[550px] mx-auto bg-bgWhite text-bgDark2 px-6 py-8 transform rounded-lg hover:shadow-md transition-transform duration-300 ease-in-out drop-shadow-md"
        >
          <h2 className="text-clampBase mb-2 font-semibold">
            Update Profile
          </h2>

          <div className="flex flex-col gap-y-5 mt-6">
            <Controller
              name="name"
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
                  id="name"
                  label="name"
                  inputProps={{ type: "name", autoComplete: "off" }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === "minLength"
                        ? "Name length is should be more than 2 characters"
                        : "Name is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
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
                    role: "presentation",
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
                  inputProps={{
                    type: "password",
                    autoComplete: "new-password",
                  }}
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
            <Controller
              name="confirmPassword"
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
                  id="confirmPassword"
                  label="ConfirmPassword"
                  inputProps={{
                    type: "password",
                    autoComplete: "new-password",
                  }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === "minLength"
                        ? "Confirm Password length is less than 6"
                        : "Confirm Password is required"
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
              Update
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default ProfileScreen;
