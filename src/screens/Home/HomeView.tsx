import { useState } from "react";
import "./HomeView.scss";
import Input from "../../components/Input";
import SearchInput from "../../components/SearchInput";
import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import OrderBooks from "../../components/OrderBooks";
import OpenOrders from "../../components/OpenOrder";
import HistoryOrder from "../../components/HistoryOrder";
import Profile from "../../components/Profile";
// import Balance from "../../components/Balance";
import LoginForm from "../../components/LoginForm";

export const TAB_ITEMS = (symbol = "") => [
  {
    key: 0,
    label: `Buy ${symbol} `,
  },
  {
    key: 2,
    label: `Sell  ${symbol}`,
  },
  {
    key: 1,
    label: "Created volume",
  },
];

const HomeView = ({
  searchValue,
  setSearchValue,
  symbols,
  onSelectSymbol,
  ordersBook,
  openOrders = [],
  historyOrder = [],
  userId,
  onLogin,
  onLogout,
  // userBalance,
  onBuy,
  buyForm,
  setBuyForm,
  createVolumeForm,
  setCreateVolumeForm,
  isBuying = false,
  sellForm,
  setSellForm,
  isSelling,
  onSell,
  cancelOrder,
  buyer,
  setBuyer,
  seller,
  setSeller,
  selectedSymbol,
  onSelectUser,
  onCreateVolume,
  reloadProfile,
  swapUser
}: any) => {
  const [tabActive, setTabActive]: any = useState(
    TAB_ITEMS(selectedSymbol?.["base-currency"])[0]?.key
  );

  const quoteCurrency= selectedSymbol?.["quote-currency"]??''

  const renderBuyForm = () => {
    return (
      <>
        <div className="flex flex-row flex-1 gap-4 my-4">
          <Input
            type="number"
            value={buyForm?.price}
            onChange={(e: any) => setBuyForm({ ...buyForm, price: e?.target?.value })}
            label="Price"
          />
          <Input
            type="number"
            value={buyForm?.amount}
            onChange={(e: any) => setBuyForm({ ...buyForm, amount: e?.target?.value })}
            label="Amount"
          />
        </div>
        <Button title={"Buy"} loading={isBuying} disabled={isBuying} onClick={onBuy} />
      </>
    );
  };

  const renderSellForm = () => {
    return (
      <>
        <div className="flex flex-row flex-1 gap-4 my-4">
          <Input
            type="number"
            value={sellForm?.price}
            onChange={(e: any) => setSellForm({ ...sellForm, price: e?.target?.value })}
            label="Price"
          />
          <Input
            type="number"
            value={sellForm?.amount}
            onChange={(e: any) => setSellForm({ ...sellForm, amount: e?.target?.value })}
            label="Amount"
          />
        </div>
        <Button title={"Sell"} loading={isSelling} disabled={isSelling} onClick={onSell} />
      </>
    );
  };

  const renderCreateVolumeForm = () => {
    return (
      <>
        <div className="flex flex-row flex-1 gap-4 my-4">
          <Input
            value={createVolumeForm?.min}
            onChange={(e: any) =>
              setCreateVolumeForm({ ...createVolumeForm, min: e?.target?.value })
            }
            label="Min"
          />
          <Input
            value={createVolumeForm?.max}
            onChange={(e: any) =>
              setCreateVolumeForm({ ...createVolumeForm, max: e?.target?.value })
            }
            label="Max"
          />
          <Input
            value={createVolumeForm?.amount}
            onChange={(e: any) =>
              setCreateVolumeForm({ ...createVolumeForm, amount: e?.target?.value })
            }
            label={`Amount ${quoteCurrency}`}
          />
          <Input
            value={createVolumeForm?.desiredVolume}
            onChange={(e: any) =>
              setCreateVolumeForm({ ...createVolumeForm, desiredVolume: e?.target?.value })
            }
            label="Count"
          />
        </div>
        <Button title={"Submit"} onClick={onCreateVolume} />
      </>
    );
  };

  const renderLoginForm = () => {
    return (
      <div className="gap-4 flex flex-col">
        {!buyer?.userId && (
          <LoginForm
            {...{
              userInfo: buyer,
              setUserInfo: setBuyer,
              onLogin: () => onLogin({ ...buyer, type: "buyer" }),
              label: "Buyer Login",
            }}
          />
        )}
        <div className="w-full h-[1px] bg-gray-600" />
        {!seller?.userId && (
          <LoginForm
            {...{
              userInfo: seller,
              setUserInfo: setSeller,
              onLogin: () => onLogin({ ...seller, type: "seller" }),
              label: "Seller Login",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 dark">
      <div className="flex flex-row justify-between">
        <SearchInput
          onSelectSymbol={onSelectSymbol}
          dataSearch={symbols}
          value={searchValue}
          onChange={(e: any) => setSearchValue(e?.target?.value)}
        />
        {(buyer?.userId || seller?.userId) && (
          <Profile
            buyer={buyer}
            symbol={selectedSymbol}
            seller={seller}
            onLogout={onLogout}
            onSelectUser={onSelectUser}
            selectedUser={userId}
            reloadProfile={reloadProfile}
            {...{ swapUser }}
          />
        )}
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <OrderBooks data={ordersBook} selectedSymbol={selectedSymbol} />
        <div className="flex flex-1 flex-col">
          {!buyer?.userId || !seller?.userId ? (
            renderLoginForm()
          ) : (
            <>
              <Tabs
                value={tabActive}
                tabs={TAB_ITEMS(selectedSymbol?.["base-currency"])}
                onChange={setTabActive}
              />
              <div className="flex-grow">
                {(() => {
                  switch (tabActive) {
                    case 0:
                      return renderBuyForm();
                    case 1:
                      return renderCreateVolumeForm();
                    case 2:
                      return renderSellForm();
                  }
                })()}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <div className="flex-1">
          {/* <Balance data={userBalance} /> */}
          <OpenOrders data={openOrders} cancelOrder={cancelOrder} />
        </div>

        <HistoryOrder label="Trade History" data={historyOrder} />
      </div>
    </div>
  );
};

export default HomeView;
