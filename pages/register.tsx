import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { API, getError} from "../utils";
import { useStoreContext } from "@/store";
import { IFormInputs } from "@/types";
import {  FormRegister, Layout } from "@/components";

export default function RegisterScreen() {
  const {
    state: { userInfo },
    dispatch,
  } = useStoreContext();
  const router = useRouter();
  const { redirect }: any = router.query;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect || "/");
    }
  }, [router, userInfo, redirect]);

  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async ({ name, email, password, confirmPassword }: IFormInputs) => {
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    try {
      const { data } = await API.post("/api/users/register", {
        name,
        email,
        password,
      });

      console.log(data);

      dispatch({ type: "USER_LOGIN", payload: data });
      router.push(redirect || "/");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Login">
      {/* @ts-ignore */}
      <div className="mt-10">
        <FormRegister redirect={redirect} submitHandler={submitHandler} />
      </div>
    </Layout>
  );
}
