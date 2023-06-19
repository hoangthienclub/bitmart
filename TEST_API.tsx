import { useState, useEffect } from "react";
import "./App.css";


function App() {
  // useEffect(() => {
  //   init()
  // }, []);

  return (
    <div className="flex flex-row w-screen">
      <button onClick={() => {
        init();
      }}></button>
    </div>
  );
}

export default App;

const floored_val = (val: number, digits: number) => {
  const power = Math.pow(10, digits);
  return +(Math.floor(val * power) / power).toFixed(digits);
}

const init = () => {
  try {
    let count = 0;
    const amountUsdt = 50000;
    const desiredVolume = 10;
    const highPrice = 26483.63
    const lowPrice = 26483.76
    const numDecimalDigits = 6
    while (count < desiredVolume) {
      const price = floored_val(
        Math.random() * (highPrice - lowPrice) + lowPrice,
        numDecimalDigits,
      );
      let amountCoin = floored_val(
        amountUsdt / price, numDecimalDigits)
  
      sellApi.sell(price, amountCoin);
      buyApi.buy(price, amountCoin);

      // get buyer user information
      if (buyer.balance < amountCoin) {
        amountCoin = buyer.balance;
      }
  
      buyApi.sell(price, amountCoin);
      sellApi.buy(price, amountCoin)

       // get seller user information
      if (sellApi.balance < amountCoin) {
        amountCoin = buyer.balance;
      }
      console.log({
        price,
        amountCoin
      })
      count++;
    }
  } catch (err) {
    buyer.cancelAllOrder();
    buyer.cancelAllOrder();
  }
}
