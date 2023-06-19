import querystring from "query-string";
import cryptoJS from "crypto-js";
import variables from "./variable";
import axios from "axios";
import STORE_KEYS from "../utils/constant";
import moment from "moment";

const getApiUrl = (url: any, parameters: any, secretKey?: string, method = "GET") => {
  const { host } = variables ?? {};
  const encoded_parameters = querystring
    .stringify(parameters)
    .replace(/\+/g, "%20")
    .replace(/\:/g, "%3A");
  const sorted_parameters = encoded_parameters.split("&").sort().join("&");
  const string_to_sign = `${method}\n${host.toLowerCase()}\n${url}\n${sorted_parameters}`;
  const signature = cryptoJS
    .HmacSHA256(string_to_sign, secretKey as string)
    .toString(cryptoJS.enc.Base64);
  const encoded_signature = encodeURIComponent(signature);
  const signed_request = `https://${host}${url}?${sorted_parameters}&Signature=${encoded_signature}`;
  return signed_request;
};

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

  let newParams: any = {
    ...DEFAULT_PARAMS,
    Timestamp: moment().utc().format("YYYY-MM-DDTHH:mm:ss"),
  };

  
  // if (isLogin) {
  //   secretKey = params?.secretKey;
  //   newParams = { ...newParams, AccessKeyId: params?.AccessKeyId };
  // } else {
  //   secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);
  //   const AccessKeyId: any = sessionStorage.getItem(STORE_KEYS.AccessKeyId);
  //   newParams.AccessKeyId = AccessKeyId;
  //   if (method === "GET") {
  //     newParams = { ...params, ...newParams };
  //   }
  // }
  if (params?.secretKey) secretKey = params?.secretKey;
  else secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);

  delete newParams?.secretKey; 
  if (params?.AccessKeyId) newParams.AccessKeyId = params?.AccessKeyId;
  else newParams.AccessKeyId = sessionStorage.getItem(STORE_KEYS.AccessKeyId);

  if (method === "GET") {
    newParams = { ...params, ...newParams };
  }

  const PostParam = { ...params };
  delete PostParam?.secretKey;
  delete PostParam.AccessKeyId


  // console.log('===================');
  // console.log("method", method);
  // console.log("newParams", newParams);
  // console.log("params", params);
  // console.log('===================');

  console.log("=============== api param" );
  console.log("params", params);
  console.log('====================================');
  console.log("newParams", newParams);
  console.log("PostParam====================================", PostParam);
  console.log("===============");
  

  const parseUrl = getApiUrl(url, newParams, secretKey, method);

  const config = {
    url: parseUrl,
    method,
    ...(method === "POST" && {
      data: PostParam,
    }),
  };

  return await axios(config);
};

export default baseApi;
