import { IProduct, IShippingAddress, IUser } from "@/types";
import Cookies from "js-cookie"; // to store user information
const { get }: any = Cookies;

export type storeState = {
  darkMode: boolean;
  cart: {
    cartItems: IProduct[] | [];
    shippingAddress: IShippingAddress | null;
    paymentMethod: string;
  };
  allProducts: IProduct[];
  userInfo: IUser | null;
};

export type storeAction = {
  type:
    | "DARK_MODE_ON"
    | "DARK_MODE_OFF"
    | "USER_LOGIN"
    | "USER_LOGOUT"
    | "PRODUCT_ADD_ITEM"
    | "CART_ADD_ITEM"
    | "CART_REMOVE_ITEM"
    | "SAVE_SHIPPING_ADDRESS"
    | "SAVE_PAYMENT_METHOD"
    | "CART_CLEAR";
  payload?: any;
};

export const storeInitialState: storeState = {
  darkMode: get("darkMode") === "ON" ? true : false,
  cart: {
    cartItems: get("cartItems") ? JSON.parse(get("cartItems")) : [],
    shippingAddress: get("shippingAddress")
      ? JSON.parse(get("shippingAddress"))
      : {},
    paymentMethod: get("paymentMethod") ? get("paymentMethod") : "",
  },
  allProducts: [],
  userInfo: get("userInfo") ? JSON.parse(get("userInfo")) : null,
};

export function storeReducer(state: storeState, action: storeAction) {
  switch (action.type) {
    case "DARK_MODE_ON":
      Cookies.set("darkMode", "ON");
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      Cookies.set("darkMode", "OFF");
      return { ...state, darkMode: false };
    case "USER_LOGIN": {
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    }
    case "USER_LOGOUT": {
      Cookies.remove("userInfo");
      Cookies.remove("cartItems");
      Cookies.remove("shippingAddress");
      Cookies.remove("paymentMethod");
      return { ...state, userInfo: null };
    }
    case "PRODUCT_ADD_ITEM": {
      return { ...state, allProducts: action.payload };
    }
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem?._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [newItem, ...state.cart.cartItems];

      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      Cookies.set("shippingAddress", JSON.stringify(action.payload));

      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }

    case "SAVE_PAYMENT_METHOD": {
      const paymentMethod: string = action.payload;
      Cookies.set("paymentMethod", paymentMethod);
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }

    case "CART_CLEAR": {
      Cookies.remove("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }

    default:
      return state;
  }
}
