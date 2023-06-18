import { IBalance } from "../../interface";
import { formatNumber } from "../../utils/helper";
import Empty from "../svg/Empty";

const Balance = ({ data = [] }: { label?: string; data?: IBalance[] }) => {
  return (
    <div className="relative mb-4 overflow-x-auto shadow-md sm:rounded-lg flex-1 max-h-[600px] overflow-auto">
      <div className="sticky top-0 p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Balance
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className=" sticky top-[68px] text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Currency
            </th>
            <th scope="col" className="px-6 py-3">
              balance
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((it: IBalance, key: number) => {
            return (
              <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className={`px-6 py-4 `}>{it?.currency}</td>
                <td className={`px-6 py-4 `}>{formatNumber(it?.balance)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!data?.length && (
        <div className="w-full h-[300px] justify-center items-center flex flex-col">
          <Empty className="w-[40px] h-[40px]" />
          No Data
        </div>
      )}
    </div>
  );
};

export default Balance;
