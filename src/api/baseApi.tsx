import cryptoJS from "crypto-js";
import variables from "./variable";
import axios from "axios";
import STORE_KEYS from "../utils/constant";
import { toast } from "react-toastify";

const BASE_URL = 'https://api-cloud.bitmart.com';

const generateSignature = (timestamp: string, body: any, secretKey: string, userName: string) => {
  const message = `${timestamp}#${userName}#${body}`;
  const hmac = cryptoJS.HmacSHA256(message, secretKey);
  return cryptoJS.enc.Hex.stringify(hmac);
}

const baseApi = async ({
  url,
  params,
  method = "GET",
  body = {},
}: {
  url: string;
  params?: any;
  body?: any;
  method?: "GET" | "POST";
}) => {
  const { DEFAULT_PARAMS } = variables ?? {};
  const secretKey = params?.secretKey ?? sessionStorage.getItem(STORE_KEYS.secretKey);
  const accessKeyId = params?.AccessKeyId ?? sessionStorage.getItem(STORE_KEYS.AccessKeyId);
  const userName = params?.userName ?? sessionStorage.getItem(STORE_KEYS.userName);
  const timestamp = new Date().getTime().toString();

  const headers: any = {
    ...DEFAULT_PARAMS,
    'X-BM-TIMESTAMP': timestamp,
    'X-BM-KEY': accessKeyId,
  };

  const xBmsign = generateSignature(timestamp, JSON.stringify(body), secretKey, userName)

  const parseUrl = `${BASE_URL}/${url}`;

  const config = {
    url: parseUrl,
    method,
    ...(method === "POST" && {
      data: body,
    }),
    headers: {
      ...headers,
      "X-BM-SIGN": xBmsign,
    }
  };
  try {
    const data = await axios(config);
    if (data?.data?.status === 'error') {
      toast(data?.data?.["err-msg"]);
      return Promise.reject(data)
    }
    else return Promise.resolve(data)
  } catch (err) {
    toast("Invalid API Key or Secret Key");
    console.log(err);
    throw err;
  }
};

export default baseApi;
