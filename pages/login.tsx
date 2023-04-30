import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { API, getError} from "../utils";
import { useStoreContext } from "@/store";
import { IFormInputs } from "@/types";
import { FormLogin, Layout } from "@/components";

export default function LoginScreen() {
  const {state: { userInfo },dispatch} = useStoreContext();
  const router = useRouter();
  const { redirect } : any = router.query;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect || "/");
    }
  }, [router, userInfo, redirect]);

  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async ({ email, password }: IFormInputs) => {
    try {
      const { data } = await API.post("/api/users/login", {
        email,
        password,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      router.push(redirect || "/");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Login">
      {/* @ts-ignore */}
        <FormLogin redirect={redirect} submitHandler={submitHandler} />
    </Layout>
  );
}
