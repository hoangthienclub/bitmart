import querystring from "query-string";
import cryptoJS from "crypto-js";
import variables from "./variable";
import axios from "axios";
import STORE_KEYS from "../utils/constant";
import moment from "moment";
import { toast } from "react-toastify";

const API_KEY = '286e00c507f81f10c8b95b894a30d30e0202c242';
const API_SECRET = '438f119328aa872b0d9260162625d49027798eb43d6f07f390400800c747f891';
const API_MEMO = 'Test';

const BASE_URL = 'https://api-cloud.bitmart.com';

// Get current timestamp


function generate_signature(timestamp: string, body: any) {
  const message = `${timestamp}#${API_MEMO}#${body}`;
  const hmac = cryptoJS.HmacSHA256(message, API_SECRET);
  return cryptoJS.enc.Hex.stringify(hmac);
}

const baseApi = async ({
  url,
  params,
  method = "GET",
  // isLogin = false,
}: {
  url: string;
  params?: any;
  method?: "GET" | "POST";
  // isLogin?: boolean;
}) => {
  const { DEFAULT_PARAMS } = variables ?? {};
  let secretKey;

  const headers: any = {
    ...DEFAULT_PARAMS,
  };

  if (params?.secretKey) secretKey = params?.secretKey;
  else secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);

  delete headers?.secretKey; 
  if (params?.AccessKeyId) headers.AccessKeyId = params?.AccessKeyId;
  else headers.AccessKeyId = sessionStorage.getItem(STORE_KEYS.AccessKeyId);

  const PostParam = { ...params };
  const xBmsign = generate_signature(headers["X-BM-TIMESTAMP"], JSON.stringify(params));
  delete PostParam?.secretKey;
  delete PostParam.AccessKeyId

  const parseUrl = `${BASE_URL}/${url}` ;

  const config = {
    url: parseUrl,
    method,
    ...(method === "POST" && {
      data: !params?.length ? PostParam : params,
    }),
    headers: {
      ...headers,
      "X-BM-SIGN": xBmsign,
    }
  };
  const data = await axios(config);
  if (data?.data?.status === 'error') {
    toast(data?.data?.["err-msg"]);
    return Promise.reject(data)
  }
  else return Promise.resolve(data)
};

export default baseApi;
