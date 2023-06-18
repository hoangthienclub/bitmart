import { memo, useEffect, useState } from "react";
import HomeView from "./HomeView";
import STORE_KEYS from "../../utils/constant";
import { useMutation, useQuery } from "react-query";
import API from "../../api/api";
import { ISymbol } from "../../interface";
import variables from "../../api/variable";
import { inflate } from "pako";
import { toast } from "react-toastify";
import allSymbolData from "../../utils/allSymbol";

let ws: any;
let preSymbol: any = null;

const defaultUserInfo = {
  accessKey: "",
  secretKey: "",
  userId: "",
  balances: [],
};

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<ISymbol>();
  const [ordersBook, setOrdersBook] = useState({});
  const [buyer, setBuyer] = useState({ ...defaultUserInfo });
  const [seller, setSeller] = useState({ ...defaultUserInfo });
  const [userId, setUserId] = useState("");
  useEffect(() => {
    console.log('12312312312');
    
    initSocket();
    getUserInfo();
  }, []);

  const [buyForm, setBuyForm] = useState({
    price: 0,
    amount: 0,
  });

  const [sellForm, setSellForm] = useState({
    price: 0,
    amount: 0,
  });

  const [createVolumeForm, setCreateVolumeForm] = useState({
    min: 0,
    max: 0,
    amount: 0,
  });

  const getUserInfo = () => {
    console.log("getUserInfo==========>", getUserInfo);
    
    const buyer = JSON.parse(sessionStorage.getItem(STORE_KEYS.BUYER) || "{}");
    const seller = JSON.parse(sessionStorage.getItem(STORE_KEYS.SELLER) || "{}");

    // const secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);
    if (buyer?.userId) {
      _onLogin({ accessKey: buyer?.accessKey, secretKey: buyer?.secretKey, type: "buyer" });
    }
    if (seller?.userId) {
      _onLogin({ accessKey: seller?.accessKey, secretKey: seller?.secretKey, type: "seller" });
    }
  };

  useEffect(() => {
    unsubscribe(ws);
    if (selectedSymbol?.symbol) {
      subscribe(ws);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (userId) {
      refetchOrders();
    }
  }, [userId]);

  const { data: userBalance, mutateAsync: getBalanceInfo } = useMutation(
    ["getAccountBalance"],
    API.getAccountBalance
  );

  const { isLoading: onLoadingLogin, mutate: _onLogin } = useMutation(
    ["getUserInfo"],
    API.getUserInfo,
    {
      onSuccess: async (data, params) => {
        if (data?.data?.status === "error") {
          toast(data?.data?.["err-msg"]);
        } else {
          const balances = await getBalanceInfo(data?.data?.data?.[0]?.id);
          if (params?.type === "buyer") {
            setBuyer({
              ...buyer,
              ...params,
              userId: data?.data?.data?.[0]?.id,
              balances: balances?.data?.data?.list,
            });
            sessionStorage.setItem(
              STORE_KEYS.BUYER,
              JSON.stringify({
                ...buyer,
                ...params,
                userId: data?.data?.data?.[0]?.id,
                balances: balances?.data?.data?.list,
              })
            );
          }
          if (params?.type === "seller") {
            setSeller({
              ...seller,
              ...params,
              userId: data?.data?.data?.[0]?.id,
              balances: balances?.data?.data?.list,
            });
            sessionStorage.setItem(
              STORE_KEYS.SELLER,
              JSON.stringify({
                ...seller,
                ...params,
                userId: data?.data?.data?.[0]?.id,
                balances: balances?.data?.data?.list,
              })
            );
          }

          // sessionStorage.setItem(STORE_KEYS.accessKeyId, params?.accessKey);
          // sessionStorage.setItem(STORE_KEYS.secretKey, params?.secretKey);
          // setUserId(data?.data?.data?.[0]?.id);
        }
      },
    }
  );

  const refetchOrders = () => {
    refetchGetOpenOrder();
    refetchGetHistoryOrder();
  };

  const { isLoading: isBuying, mutate: _onBuyOrder } = useMutation(["buyOrder"], API.buyOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
      } else {
        refetchOrders();
      }
    },
  });

  const { isLoading: isSelling, mutate: _onSellOrder } = useMutation(["sellOrder"], API.buyOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
      } else {
        refetchOrders();
      }
    },
  });

  const { mutate: _onCancelOrder } = useMutation(["cancelOrder"], API.cancelOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
      } else {
        refetchOrders();
      }
    },
  });

  const { data: historyOrder, refetch: refetchGetHistoryOrder } = useQuery(
    ["getHistoryOrder", { userId }],
    () =>
      API.getHistoryOrder({
        "account-id": userId,
      }),
    {
      enabled: !!userId,
    }
  );

  const { data: openOrder, refetch: refetchGetOpenOrder } = useQuery(
    ["getOpenOrder", { userId }],
    () => API.getOpenOrder({ "account-id": userId }),
    { enabled: !!userId }
  );

  // const getOpenOrder = async () => {
  //   const buys = onGetOpenOrder({
  //     "account-id": userId,
  //     // symbol: selectedSymbol?.symbol,
  //     // side: "buy",
  //   });
  //   const sells = onGetOpenOrder({
  //     "account-id": userId,
  //     // symbol: selectedSymbol?.symbol,
  //     // side: "buy",
  //   });
  //   const [buysData, sellsData] = await Promise.all([buys, sells]);

  //   setOpenOrders([
  //     ...buysData?.data?.data?.map((it: any) => ({ ...it, side: "buy" })),
  //     ...sellsData?.data?.data?.map((it: any) => ({ ...it, side: "sell" })),
  //   ]);
  // };

  const {} = useQuery(["getAllSymbol"], () => API.getAllSymbol(), {
    onSuccess: (data) =>
      localStorage.setItem(STORE_KEYS?.ALL_SYMBOL, JSON.stringify(data?.data?.data)),
    enabled: !!userId,
  });

  const onLogout = () => {
    setUserId("");
    sessionStorage.clear();
    setBuyer({ ...defaultUserInfo });
    setSeller({ ...defaultUserInfo });
  };

  const initSocket = () => {
    ws = new WebSocket(variables.WS_URL);
    ws.onopen = function open() {};
    ws.onmessage = function (data: any) {
      const fileReader = new FileReader();
      fileReader.onload = function (event: any) {
        const convertedData = event.target.result;
        const text: any = inflate(convertedData, {
          to: "string",
        });
        const msg: any = JSON.parse(text);
        if (msg.ping) {
          ws.send(
            JSON.stringify({
              pong: msg.ping,
            })
          );
        } else if (msg.tick) {
          handle(msg);
        } else {
          console.log(text);
        }
      };

      fileReader.readAsArrayBuffer(data.data);
    };
    ws.onerror = function error(err: any) {
      console.log(err);
    };
    ws.onclose = function error(err: any) {
      console.log(err);
    };
  };

  const handle = (data: any) => {
    // const symbol = data.ch.split(".")[1];
    // const channel = data.ch.split(".")[2];
    // const { asks, bids } = data.tick ?? {}
    setOrdersBook(data.tick);
    // setOrders({
    //     open:asks,
    //     history: bids
    // })
    // switch (channel) {
    //     case "depth":
    //         console.log(data.tick)
    //         // orderbook[symbol] = data.tick;
    //         break;
    // }
  };

  function unsubscribe(ws: any) {
    if (preSymbol)
      ws.send(
        JSON.stringify({
          unsub: `market.${preSymbol?.symbol}.depth.step0`,
        })
      );
  }

  const subscribe = (ws: any) => {
    ws.send(
      JSON.stringify({
        sub: `market.${selectedSymbol?.symbol}.depth.step0`,
        step: "step0",
        symbol: `${selectedSymbol?.symbol}`,
      })
    );
  };

  const allSymbol = localStorage.getItem(STORE_KEYS?.ALL_SYMBOL)
    ? JSON.parse(localStorage.getItem(STORE_KEYS?.ALL_SYMBOL) || "[]")
    : allSymbolData;

  const searchedSymbol =
    searchValue !== "" ? allSymbol?.filter((it: ISymbol) => it?.symbol?.includes(searchValue)) : [];

  const onSelectSymbol = (it: ISymbol) => {
    preSymbol = selectedSymbol;
    setSelectedSymbol(it);
  };

  const onBuy = () => {
    _onBuyOrder({
      symbol: selectedSymbol?.symbol,
      price: buyForm?.price,
      amount: buyForm.amount,
      "account-id": userId?.toString(),
    });
  };

  const onSell = () => {
    _onSellOrder({
      symbol: selectedSymbol?.symbol,
      price: buyForm?.price,
      amount: buyForm.amount,
      "account-id": userId?.toString(),
    });
  };

  const cancelOrder = (id: string) => {
    _onCancelOrder({
      symbol: selectedSymbol?.symbol as string,
      orderId: id,
    });
  };
  
  return (
    <HomeView
      {...{
        symbols: searchedSymbol,
        searchValue,
        setSearchValue,
        onSelectSymbol,
        ordersBook,
        openOrders: openOrder?.data?.data,
        // openOrders: [
        //   {
        //     symbol: "apnusdt",
        //     source: "web",
        //     price: "1.555550000000000000",
        //     "created-at": 1630633835224,
        //     amount: "572.330000000000000000",
        //     "account-id": 13496526,
        //     "filled-cash-amount": "0.0",
        //     "client-order-id": "",
        //     "filled-amount": "0.0",
        //     "filled-fees": "0.0",`
        //     id: 357630527817871,
        //     state: "submitted",
        //     type: "sell-limit",
        //   },
        // ],
        historyOrder: historyOrder?.data?.data,
        userId,
        // userInfo,
        // setUserInfo,
        onLogin: _onLogin,
        onLoadingLogin,
        onLogout,
        // userBalance: userBalance?.data?.data?.list?.filter((it: any) => +it?.balance > 0),
        buyForm,
        setBuyForm,
        createVolumeForm,
        setCreateVolumeForm,
        onBuy,
        isBuying,
        sellForm,
        setSellForm,
        onSell,
        isSelling,
        cancelOrder,
        buyer,
        setBuyer,
        seller,
        setSeller,
        selectedSymbol,
        onSelectUser: (id: string) => setUserId(id),
      }}
    />
  );
};

export default memo(Home);
