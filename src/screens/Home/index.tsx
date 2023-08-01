import { memo, useEffect, useState } from "react";
import HomeView from "./HomeView";
import STORE_KEYS from "../../utils/constant";
import { useMutation, useQuery } from "react-query";
import API from "../../api/api";
import { ISymbol } from "../../interface";
import variables from "../../api/variable";
import { inflate, inflateRaw } from "pako";
import { toast } from "react-toastify";
import allSymbolData from "../../utils/allSymbol";
import { delay, floored_val, separatedArray } from "../../utils/helper";

let ws: any;
let preSymbol: any = null;
const numDecimalDigits = 4;
const itemsPerBatch = 10;

const defaultUserInfo = {
  AccessKeyId: "",
  secretKey: "",
  userId: "",
  userName: "",
  balances: [],
};

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<ISymbol>();
  const [ordersBook, setOrdersBook] = useState({});
  const [buyer, setBuyer] = useState({ ...defaultUserInfo });
  const [seller, setSeller] = useState({ ...defaultUserInfo });
  const [userId, setUserId] = useState("");
  const [userSelectedInfo, setUserSelectedInfo] = useState({ ...defaultUserInfo });
  const [createVolLoading, setCreateVolLoading] = useState(false)
  useEffect(() => {
    
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

  const [sellBatchForm, setSellBatchForm] = useState({
    min: 0,
    max: 0,
    amountPerPrice: 0,
    step: 0,
  });

  const [createVolumeForm, setCreateVolumeForm] = useState({
    min: 0,
    max: 0,
    amount: 0,
    desiredVolume: 0
  });
  const getUserInfo = () => {
    
    const buyer = JSON.parse(sessionStorage.getItem(STORE_KEYS.BUYER) || "{}");
    const seller = JSON.parse(sessionStorage.getItem(STORE_KEYS.SELLER) || "{}");

    // const secretKey = sessionStorage.getItem(STORE_KEYS.secretKey);
    if (buyer?.userId) {
      _onLogin({ AccessKeyId: buyer?.AccessKeyId, secretKey: buyer?.secretKey, type: "buyer", userName: buyer?.userName });
    }
    if (seller?.userId) {
      _onLogin({ AccessKeyId: seller?.AccessKeyId, secretKey: seller?.secretKey, type: "seller", userName: seller?.userName  });
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
  const { data: a, mutateAsync: getAllSymbol } = useMutation(
    ["getAllSymbol"],
    API.getAllSymbol,
  )
  // API.getAllSymbol(), {
  //   onSuccess: (data) =>
  //     localStorage.setItem(STORE_KEYS?.ALL_SYMBOL, JSON.stringify(data?.data?.data)),
  //   enabled: !!userId,
  // });

  const { isLoading: onLoadingLogin, mutate: _onLogin } = useMutation(
    ["getUserInfo"],
    API.getUserInfo,
    {
      onSuccess: async (data, params) => {
        if (data?.data?.status === "error") {
          toast(data?.data?.["err-msg"]);
        } else {
          const symbols = await getAllSymbol(params);
          localStorage.setItem(STORE_KEYS?.ALL_SYMBOL, JSON.stringify(symbols?.data?.data?.symbols));
          if (params?.type === "buyer") {
            setBuyer({
              ...buyer,
              ...params,
              userId: params.AccessKeyId,
              balances: data?.data?.data?.wallet,
              userName: params.userName,
            });
            sessionStorage.setItem(
              STORE_KEYS.BUYER,
              JSON.stringify({
                ...buyer,
                ...params,
                userId: params.AccessKeyId,
                balances: data?.data?.data?.wallet,
                userName: params.userName,
              })
            );
          }
          if (params?.type === "seller") {
            setSeller({
              ...seller,
              ...params,
              userId: params.AccessKeyId,
              balances: data?.data?.data?.wallet,
              userName: params.userName,
            });
            sessionStorage.setItem(
              STORE_KEYS.SELLER,
              JSON.stringify({
                ...seller,
                ...params,
                userId: params.AccessKeyId,
                balances: data?.data?.data?.wallet,
                userName: params.userName,
              })
            );
          }

          // sessionStorage.setItem(STORE_KEYS.AccessKeyId, params?.AccessKeyId);
          // sessionStorage.setItem(STORE_KEYS.secretKey, params?.secretKey);
          // setUserId(data?.data?.data?.[0]?.id);
        }
        
      },
      onError: (err: any) => console.log('onError', err)
      
    }
  );

  const refetchOrders = () => {
    console.log("userSelectedInfo:", userSelectedInfo)
    refetchGetOpenOrder();
    refetchGetHistoryOrder();
  };

  const { isLoading: isBuying, mutate: _onBuyOrder } = useMutation(["buyOrder"], API.buyOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
        throw new Error("Error");
      } else {
        refetchOrders();
      }
    },
    onError: (error) => {
      console.log('error')
      throw new Error("Error");
    }
  });

  const { isLoading: isSelling, mutateAsync: _onSellOrderAsync, mutate: _onSellOrder } = useMutation(["sellOrder"], API.sellOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
      } else {
        refetchOrders();
      }
    },
  });

  const { isLoading: isBatchSelling, mutate: _onSellBatchOrder } = useMutation(["sellOrder"], API.sellBatchOrder, {
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
        throw new Error("Error");
      } else {
        refetchOrders();
      }
    },
    onError: (error) => {
      console.log('error')
      throw new Error("Error");
    }
  });

  const { mutate: _onCancelAllOrder } = useMutation(["cancelAllOrder"], API.cancelAllOrder, {
    onSuccess: (data) => {
      if (data?.data?.status === "error") {
        toast(data?.data?.["err-msg"]);
        throw new Error("Error");
      } else {
        refetchOrders();
      }
    },
    onError: (error) => {
      console.log('error')
      throw new Error("Error");
    }
  });

  const { data: historyOrder, refetch: refetchGetHistoryOrder } = useQuery(
    ["getHistoryOrder", { userId }],
    () =>
      API.getHistoryOrder({
        userInfo: {
          AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
        }
      }),
    {
      enabled: !!userId,
    }
  );

  const { data: openOrder, refetch: refetchGetOpenOrder } = useQuery(
    ["getOpenOrder", { userId }],
    () => API.getOpenOrder({
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    }),
    { enabled: !!userId }
  );

  const _ = useQuery(["getAllSymbol"], () => API.getAllSymbol(), {
    onSuccess: (data) =>
      localStorage.setItem(STORE_KEYS?.ALL_SYMBOL, JSON.stringify(data?.data?.data?.symbols)),
    enabled: !!userId,
  });

  const onLogout = () => {
    setUserId("");
    sessionStorage.clear();
    setUserSelectedInfo({...defaultUserInfo });
    setBuyer({ ...defaultUserInfo });
    setSeller({ ...defaultUserInfo });
  };

  const initSocket = () => {
    

    ws = new WebSocket(variables.WS_URL);
    ws.onopen = function open() {
      const sendPing = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }
      setInterval(sendPing, 10000);
    };
    ws.onmessage = function (data: any) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = function (event: any) {
          const convertedData = event.target.result;
          const text: any = inflateRaw(convertedData, {
            to: "string",
          });
          const msg: any = JSON.parse(text);
          if (msg.ping) {
            ws.send(
              JSON.stringify({
                pong: msg.ping,
              })
            );
          } else if (msg.data) {
            handle(msg);
          } else {
            console.log(text);
          }
        };
        if (data?.data) {
          fileReader.readAsArrayBuffer(data.data);
        }
      } catch (error) {
        console.log();
      }
    };
    ws.onerror = function error(err: any) {
      console.log(err);
    };
    ws.onclose = function error(err: any) {
      console.log("close")
      console.log(err);
    };
  };

  const handle = (data: any) => {
    // const symbol = data.ch.split(".")[1];
    // const channel = data.ch.split(".")[2];
    // const { asks, bids } = data.tick ?? {}
    setOrdersBook(data.data);
    // setOrders(
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
          op: "unsubscribe",
          args: [`spot/depth20:${preSymbol?.symbol}`]
        })
      );
  }

  const subscribe = (ws: any) => {
    ws.send(
      JSON.stringify({
        op: "subscribe",
        args: [`spot/depth20:${selectedSymbol?.symbol}`]
      })
    );
  };

  const allSymbol = localStorage.getItem(STORE_KEYS?.ALL_SYMBOL)
    ? JSON.parse(localStorage.getItem(STORE_KEYS?.ALL_SYMBOL) || "[]")
    : allSymbolData;

  const searchedSymbol =
    searchValue !== "" ? allSymbol?.filter((it: ISymbol) => it?.symbol?.toLowerCase()?.includes(searchValue?.toLowerCase())) : [];

  const onSelectSymbol = (it: ISymbol) => {
    preSymbol = selectedSymbol;
    setSelectedSymbol(it);
  };

  const onBuy = () => {
    if (!userId) {
      toast("Please select user");
      return;
    }
    if (!selectedSymbol) {
      toast("Please select symbol");
      return;
    }
    _onBuyOrder({
      body: {
        symbol: selectedSymbol?.symbol ?? "",
        side: "buy",
        type:"limit",
        price: buyForm?.price,
        size: buyForm.amount,
      },
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    });
    refetchOrders();
  };

  // const onSell = () => {
  //   _onSellOrder({
  //     symbol: selectedSymbol?.symbol ?? '',
  //     price: sellForm?.price,
  //     amount: sellForm.amount,
  //     AccessKeyId: userSelectedInfo?.AccessKeyId,
  //     secretKey: userSelectedInfo?.secretKey,
  //     "account-id": userSelectedInfo?.userId,
  //   });
  //   refetchOrders();
  // };

  const onSellBatch = async () => {
    if (!userId) {
      toast("Please select user");
      return;
    }
    if (!selectedSymbol) {
      toast("Please select symbol");
      return;
    }
    const { min, max, amountPerPrice, step } = sellBatchForm;
    
    const userBalances = await getBalanceInfo({
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    });
    let userBalance = +userBalances?.data?.data?.wallet?.find(
      (it: any) =>
        it?.currency === selectedSymbol?.["base_currency"]
    )?.available || 0;

    const data = [];
    for (let price = +min; price <= +max;  price += (+step)) {
      if (+userBalance <= +amountPerPrice) break;
      data.push({
        symbol: selectedSymbol?.symbol ?? '',
        price: floored_val(price, numDecimalDigits).toString(),
        size: amountPerPrice.toString(),
        side: "sell",
        type: "limit"
      })
      userBalance = +userBalance - (+amountPerPrice);
    } 
    const datas = separatedArray(data, itemsPerBatch);
    await Promise.all(datas.map((item: any) => {
      _onSellBatchOrder({
        body: {
          order_params: item
        },
        userInfo: {
          AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
        }
      });
    }))
    refetchOrders();
  };

  const cancelOrder = (id: string, symbol: string) => {
    _onCancelOrder({
      body: {
        symbol,
        order_id: id,
      },
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    });
  };

  const cancelAllOrder = () => {
    if (!selectedSymbol) {
      toast("Please select symbol");
      return;
    }
    _onCancelAllOrder({
      body: {
        symbol: selectedSymbol?.symbol ?? "",
        side:"buy"
      },
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    });
    _onCancelAllOrder({
      body: {
        symbol: selectedSymbol?.symbol ?? "",
        side:"sell"
      },
      userInfo: {
        AccessKeyId: userSelectedInfo?.AccessKeyId, secretKey: userSelectedInfo?.secretKey, userName: userSelectedInfo?.userName 
      }
    });
  };

  const onSelectUser = (userInfo: any) => {
    sessionStorage.setItem(STORE_KEYS.AccessKeyId, userInfo?.AccessKeyId);
    sessionStorage.setItem(STORE_KEYS.secretKey, userInfo?.secretKey);
    sessionStorage.setItem(STORE_KEYS.userName, userInfo?.userName);
    setUserId(userInfo?.userId);
    setUserSelectedInfo(userInfo)
  };
  
  const onCreateVolume = async () => {
    setCreateVolLoading(true)
    // const { min, max, amount, desiredVolume } = createVolumeForm;
    // const user1=  seller;
    // const user2 = buyer;
    
    // try {
    //   let count = 0;
    //   while (count < +desiredVolume) {
    //     toast(`Count Time : ${count + 1}`)
    //     const price = floored_val(
    //       Math.random() * (+max - (+min)) + +min,
    //       numDecimalDigits,
    //     );
        
    //     let amountCoin = floored_val(
    //       amount / price, numDecimalDigits)
    //     //Step 1 : user1 sells coin


    //     //  get user1 user information
    //     const user1Balances = await getBalanceInfo({
    //       userId: user1?.userId,
    //       AccessKeyId: user1?.AccessKeyId,
    //       secretKey: user1?.secretKey,
    //     });

    //     const user1Balance = user1Balances?.data?.data?.list?.find(
    //       (it: any) =>
    //         it?.currency === selectedSymbol?.["base_currency"]
    //     );
    //       //checking
    //     if (+user1Balance?.balance < +amountCoin) {
    //       amountCoin = floored_val(+user1Balance?.balance, numDecimalDigits)
    //     }
        
    //     await _onSellOrderAsync({
    //       "account-id": user1?.userId,
    //       price,
    //       amount: amountCoin,
    //       symbol: selectedSymbol?.symbol ?? "",
    //       AccessKeyId: user1?.AccessKeyId,
    //       secretKey: user1?.secretKey,
    //     });
    //     //Step 2 : user2 buys coin
    //     await _onBuyOrder({
    //       "account-id": user2?.userId,
    //       price,
    //       amount: amountCoin,
    //       symbol: selectedSymbol?.symbol ?? "",
    //       AccessKeyId: user2?.AccessKeyId,
    //       secretKey: user2?.secretKey,
    //     });
    //     // Step3 : check user2 balanance
    //     await delay(2000);
    //     const user2Balances = await getBalanceInfo({
    //       userId: user2?.userId,
    //       AccessKeyId: user2?.AccessKeyId,
    //       secretKey: user2?.secretKey,
    //     });
    //     const user2Balance = user2Balances?.data?.data?.list?.find(
    //       (it: any) =>
    //         it?.currency === selectedSymbol?.["base_currency"]
    //     );
    //     if (+user2Balance?.balance < +amountCoin) {
    //       amountCoin = floored_val(+user2Balance?.balance, numDecimalDigits)
    //     }
    //     //Step 4 : user2 sells coin
    //     if (amountCoin <= 0) throw new Error("Insufficient balance");
    //     await _onSellOrderAsync({
    //       "account-id": user2?.userId,
    //       price,
    //       amount: amountCoin,
    //       symbol: selectedSymbol?.symbol ?? "",
    //       AccessKeyId: user2?.AccessKeyId,
    //       secretKey: user2?.secretKey,
    //     });
    //     //Step 5 : user1 buys coin

    //     await _onBuyOrder({
    //       "account-id": user1?.userId,
    //       price,
    //       amount: amountCoin,
    //       symbol: selectedSymbol?.symbol ?? "",
    //       AccessKeyId: user1?.AccessKeyId,
    //       secretKey: user1?.secretKey,
    //     });

    //     count++;
    //   }
    // } catch (err) {
    //   const cancelUser1Order = API.cancelAllOrder({ userId: user1?.userId, symbol: selectedSymbol?.symbol ?? '', size: desiredVolume, side: 'sell', types: 'sell-limit', AccessKeyId: user1?.AccessKeyId ?? '', secretKey: user1?.secretKey ?? '' });

    //   const cancelUser2Order = API.cancelAllOrder({ userId: user2?.userId, symbol: selectedSymbol?.symbol ?? '', size: desiredVolume, side: 'sell', types: 'sell-limit', AccessKeyId: user2?.AccessKeyId ?? '', secretKey: user2?.secretKey ?? '' });
    //   await Promise.all([cancelUser1Order, cancelUser2Order])
    // }
  }

  const reloadProfile = () => {
    if (buyer?.userId) {
      _onLogin({ AccessKeyId: buyer?.AccessKeyId, secretKey: buyer?.secretKey, type: "buyer", userName: buyer?.userName });
    }
    if (seller?.userId) {
      _onLogin({ AccessKeyId: seller?.AccessKeyId, secretKey: seller?.secretKey, type: "seller", userName: seller?.userName });
    }
    if(userSelectedInfo?.userId){
      refetchOrders();
    }
  };

  const swapUser = () => {
    const buyer = JSON.parse(sessionStorage.getItem(STORE_KEYS.BUYER) || "{}");
    const seller = JSON.parse(sessionStorage.getItem(STORE_KEYS.SELLER) || "{}");

    const buyerState = { ...buyer }
    const sellerState = { ...seller }
    setBuyer(sellerState);
    setSeller(buyerState);


    sessionStorage.setItem(
      STORE_KEYS.BUYER,
      JSON.stringify({
        ...seller
      })
    );
    sessionStorage.setItem(
      STORE_KEYS.SELLER,
      JSON.stringify({
        ...buyer
      })
    );

  }
  
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
        sellBatchForm,
        setSellBatchForm,
        onSellBatch,
        isBatchSelling,
        cancelOrder,
        cancelAllOrder,
        buyer,
        setBuyer,
        seller,
        setSeller,
        selectedSymbol,
        onSelectUser,
        onCreateVolume,
        reloadProfile,
        swapUser
      }}
    />
  );
};

export default memo(Home);
