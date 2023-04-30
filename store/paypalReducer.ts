import { IOrder } from "@/types";

export type paypalInitialStateType = {
  loading: boolean;
  order: IOrder | null;
  error: string;
  successPay?: boolean;
};

export type paypalActionType = {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "PAY_REQUEST"
    | "PAY_SUCCESS"
    | "PAY_FAIL"
    | "PAY_RESET";
  payload?: any;
};

export const paypalInitialState: paypalInitialStateType = {
  loading: true,
  order: null,
  error: "",
  successPay : false
};

export function paypalReducer(
  state: paypalInitialStateType,
  action: paypalActionType
) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      return state;
  }
}
