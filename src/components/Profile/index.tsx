import ProfileIc from "../svg/Profile";
import MemoLogout from "../svg/Logout";
import { formatNumber } from "../../utils/helper";
import { ISymbol } from "../../interface";

const Profile = ({
  buyer,
  seller,
  onLogout,
  symbol,
  onSelectUser,
  selectedUser,
}: {
  buyer: any;
  seller: any;
  symbol: ISymbol;
  onLogout: () => void;
  onSelectUser: (id: string) => void;
  selectedUser: string;
}) => {
  const { balances: sellerBalances } = seller ?? {};
  const { balances: buyerBalances } = buyer ?? {};

  const selectedSellerBalance =
    symbol &&
    sellerBalances?.filter(
      (it: any) =>
        [symbol?.["base-currency"], symbol?.["quote-currency"]]?.includes(it?.currency) &&
        it?.type === "trade"
    );
  const selectedBuyerBalance =
    symbol &&
    buyerBalances?.filter(
      (it: any) =>
        [symbol?.["base-currency"], symbol?.["quote-currency"]]?.includes(it?.currency) &&
        it?.type === "trade"
    );

  const renderUserInfo = ({ label, balances, userInfo }: any) => {
    return (
      <div
        className={`flex flex-row mx-2 cursor-pointer ${
          selectedUser === userInfo?.userId ? "bg-blue-800 rounded-md p-2" : ""
        }`}
        onClick={() => onSelectUser(userInfo)}>
        <ProfileIc className="mx-2" />
        <div className="mr-2">{label}</div>
        {balances && (
          <div className="flex">
            (
            {balances?.map((balance: any) => (
              <div className="mr-2">
                {formatNumber(balance?.balance)} {balance?.currency}
              </div>
            ))}
            )
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-row justify-center items-center">
      {seller?.userId &&
        renderUserInfo({
          label: "Seller",
          balances: selectedSellerBalance,
          userInfo: seller,
        })}
        {buyer?.userId &&
        renderUserInfo({ label: "Buyer", balances: selectedBuyerBalance, userInfo: buyer })}
      <MemoLogout onClick={onLogout} className="cursor-pointer ml-2 w-5 h-5" />
    </div>
  );
};

export default Profile;
