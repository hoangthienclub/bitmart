import { useEffect, useState } from "react";
import HomeView from "./HomeView";
import STORE_KEYS from "../../utils/constant";
import { useMutation, useQuery } from "react-query";
import API from "../../api/api";
import { IOpenOrder, ISymbol } from "../../interface";
import variables from "../../api/variable";
import { inflate } from "pako";
import { toast } from "react-toastify";
import allSymbolData from "../../utils/allSymbol";

let ws: any;
let preSymbol: any = null;

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<ISymbol>();
  const [ordersBook, setOrdersBook] = useState({});
  const [openOrders, setOpenOrders] = useState<IOpenOrder[]>([]);
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState<{ accessKey: string; secretKey: string }>({
    accessKey: "",
    secretKey: "",
  });
  useEffect(() => {
    initSocket();
    getUserInfo();
  }, []);

  const [buyForm, setBuyForm] = useState({
    price: 0,
    amount: 0,
  });

  const [createVolumeForm, setCreateVolumeForm] = useState({
    min: 0,
    max: 0,
    amount: 0,
  });

  const getUserInfo = () => {
    const accessKeyId = sessionStorage.getItem(STORE_KEYS.accessKeyId);
    const secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);
    if (accessKeyId && secretKey) {
      _onLogin({ accessKey: accessKeyId, secretKey: secretKey });
    }
  };

  useEffect(() => {
    unsubscribe(ws);
    if (selectedSymbol?.symbol) {
      subscribe(ws);
    }
  }, [selectedSymbol]);

  // useEffect(() => {
  //   if (userId) {
  //     getOpenOrder();
  //   }
  // }, [userId, selectedSymbol]);

  const { data: userBalance } = useQuery(
    ["getAccountBalance", { userId }],
    () => API.getAccountBalance(userId),
    {
      enabled: !!userId,
    }
  );

  const { isLoading: onLoadingLogin, mutate: _onLogin } = useMutation(
    ["getUserInfo"],
    API.getUserInfo,
    {
      onSuccess: (data, params) => {
        if (data?.data?.status === "error") {
          toast(data?.data?.["err-msg"]);
        } else {
          sessionStorage.setItem(STORE_KEYS.accessKeyId, params?.accessKey);
          sessionStorage.setItem(STORE_KEYS.secretKey, params?.secretKey);
          setUserId(data?.data?.data?.[0]?.id);
        }
      },
    }
  );

  const { isLoading: isBuying, mutate: _onBuyOrder } = useMutation(["buyOrder"], API.buyOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
      } else {
        refetchGetOpenOrder();
      }
    },
  });

  const onLogin = () => {
    _onLogin({ accessKey: userInfo?.accessKey, secretKey: userInfo?.secretKey });
  };

  const { data: historyOrder } = useQuery(
    ["getHistoryOrder", { userId, symbol: selectedSymbol?.symbol }],
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
    () => API.getOpenOrder({ "account-id": userId })
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
    setUserInfo({
      accessKey: "",
      secretKey: "",
    });
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
      // "client-order-id": "a0001",
      // source: "spot-api",
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
        historyOrder: historyOrder?.data?.data,
        userId,
        userInfo,
        setUserInfo,
        onLogin,
        onLoadingLogin,
        onLogout,
        userBalance: userBalance?.data?.data?.list?.filter((it: any) => +it?.balance > 0),
        buyForm,
        setBuyForm,
        createVolumeForm,
        setCreateVolumeForm,
        onBuy,
        isBuying,
      }}
    />
  );
};

export default Home;
