import axios from "axios";
import Moment from "react-moment";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const getError = (err: any) =>
  err.message && err.response && err.response.data
    ? err.message + " | ->" + err.response.data
    : err.message;

export const formatUserName = (str: string) => {
  const firstChar = str.charAt(0);
  const indexOfSecondChar = str.indexOf(" ") + 1;
  const secondChar = str.charAt(indexOfSecondChar);
  return firstChar + secondChar;
};

export const formatDateAgo = (timeStamp: string | undefined) => {
  return <Moment fromNow>{timeStamp}</Moment>
};
