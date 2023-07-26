import querystring from "query-string";
import cryptoJS from "crypto-js";
import variables from "./variable";
import axios from "axios";
import STORE_KEYS from "../utils/constant";
import moment from "moment";
import { toast } from "react-toastify";

const BASE_URL = 'https://api-cloud.bitmart.com';

function get_timestamp() {
  return new Date().getTime().toString();
}

function generateSignature(timestamp: string, body: string, apiMemo?: string, apiSecret?: string,){
  // const message = `${timestamp}#${apiMemo}#${body}`;
  const message = `${timestamp}#Test#${body}`;
  console.log({message})
  const hmac = cryptoJS.HmacSHA256(message, "438f119328aa872b0d9260162625d49027798eb43d6f07f390400800c747f89");
  // const hmac = cryptoJS.HmacSHA256(message, apiSecret || "");
  return cryptoJS.enc.Hex.stringify(hmac);
}

const baseApi = async ({
  url,
  params,
  body = {},
  method = "GET",
  userKey,
}: {
  url: string;
  params?: any;
  body?: any;
  userKey?: { AccessKeyId: string, secretKey: string, userName: string };
  method?: "GET" | "POST";
}) => {
  const { DEFAULT_PARAMS } = variables ?? {};
  const apiMemo = userKey?.userName ?? sessionStorage.getItem(STORE_KEYS.userName) ?? "";
  const secretKey = userKey?.secretKey ?? sessionStorage.getItem(STORE_KEYS.secretKey) ?? "";
  const timestamp = get_timestamp();

  const headers: any = {
    ...DEFAULT_PARAMS,
    'X-BM-TIMESTAMP': timestamp
  };
  console.log({body})

  if (userKey?.AccessKeyId) headers['X-BM-KEY'] = userKey?.AccessKeyId;
  else headers['X-BM-KEY'] = sessionStorage.getItem(STORE_KEYS.AccessKeyId);

  let xBmsign;
  if (method !== "GET") {
    xBmsign = generateSignature(timestamp, JSON.stringify(body), apiMemo, secretKey);
  }

  const parseUrl = `${BASE_URL}/${url}`;

  const config = {
    url: parseUrl,
    method,
    ...(method === "POST" && {
      data: body,
    }),
    headers: {
      ...headers,
      "X-BM-KEY": "286e00c507f81f10c8b95b894a30d30e0202c242",
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
    throw err;
  }
};

export default baseApi;
