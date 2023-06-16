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

const TAB_ITEMS = [
  {
    key: 0,
    label: "Buy",
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
  userInfo,
  setUserInfo,
  onLogin,
  onLoadingLogin,
  onLogout,
  userBalance
}: any) => {
  const [tabActive, setTabActive]: any = useState(TAB_ITEMS[0]?.key);
  const [buyForm, setBuyForm] = useState({
    price: "0",
    amount: "0",
  });

  const [createVolumeForm, setCreateVolumeForm] = useState({
    min: "0",
    max: "0",
    amount: "0",
  });

  const renderBuyForm = () => {
    return (
      <>
        <div className="flex flex-row flex-1 gap-4 my-4">
          <Input
            value={buyForm?.price}
            onChange={(e: any) => setBuyForm({ ...buyForm, price: e?.target?.value })}
            label="Price"
          />
          <Input
            value={buyForm?.amount}
            onChange={(e: any) => setBuyForm({ ...buyForm, amount: e?.target?.value })}
            label="Amount"
          />
        </div>
        <Button title={"Submit"} onClick={() => {}} />
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
            label="Amount"
          />
        </div>
        <Button title={"Submit"} onClick={() => {}} />
      </>
    );
  };

  const renderLoginForm = () => {
    return (
      <div>
        <div className="text-center text-2xl font-bold">Login</div>
        <div className="flex flex-row flex-1 gap-4 my-4">
          <Input
            value={userInfo?.accessKey}
            onChange={(e: any) => setUserInfo({ ...userInfo, accessKey: e?.target?.value })}
            label="Access Key"
          />
          <Input
            value={userInfo?.secretKey}
            onChange={(e: any) => setUserInfo({ ...userInfo, secretKey: e?.target?.value })}
            label="Secret Key"
          />
        </div>
        <Button
          title={"Login"}
          loading={onLoadingLogin}
          disabled={onLoadingLogin || !(userInfo?.accessKey && userInfo?.secretKey)}
          onClick={onLogin}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row justify-between">
        <SearchInput
          onSelectSymbol={onSelectSymbol}
          dataSearch={symbols}
          value={searchValue}
          onChange={(e: any) => setSearchValue(e?.target?.value)}
        />
        {userId && <Profile userId={userId} onLogout={onLogout} userBalance={userBalance} />}
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <OrderBooks data={ordersBook} />
        <div className="flex flex-1 flex-col">
          {!userId ? (
            renderLoginForm()
          ) : (
            <>
              <Tabs value={tabActive} onChange={setTabActive} />
              <div className="flex-grow">
                {tabActive === 0 ? renderBuyForm() : renderCreateVolumeForm()}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <OpenOrders data={openOrders} />
        <HistoryOrder label="Trade History" data={historyOrder} />
      </div>
    </div>
  );
};

export default HomeView;
