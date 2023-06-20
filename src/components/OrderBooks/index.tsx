import { ISymbol } from "../../interface";
import { formatNumber } from "../../utils/helper";
import Empty from "../svg/Empty";
import './OrderBooks.scss'
const OrderBooks = ({
  label = "Orders Book",
  data,
  selectedSymbol,
}: {
  label?: string;
  data?: any;
  selectedSymbol: ISymbol;
}) => {
  const { bids, asks } = data ?? {};

  const currency = selectedSymbol?.symbol
    ? selectedSymbol?.["base-currency"] + ' - ' + selectedSymbol?.["quote-currency"]
    : "";

  return (
    <div className="dark orders-book-table relative flex-[2] overflow-x-auto shadow-md sm:rounded-lg max-h-[600px] overflow-auto">
      <div className="sticky top-0 p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        {label}
        {currency && <span className="ml-2">({currency})</span>}
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className=" sticky top-[68px] text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Total
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="pl-6 pr-2 py-3 text-end">
              Price
            </th>
            <th scope="col" className="pr-6 pl-2 py-3 text-start">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {bids?.map((it: any, index: number) => {
            return (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 text-green-500 font-medium  whitespace-nowrap"></th>
                <th scope="row" className="px-6 py-4 font-medium text-green-500 whitespace-nowrap">
                  {formatNumber(it?.[1])}
                </th>
                <td className="py-4 text-green-500 pl-6 pr-2 text-end">{formatNumber(it?.[0])}</td>
                <td className="py-4 text-red-500 pr-6 pl-2 text-start">
                  {formatNumber(asks?.[index]?.[0])}
                </td>
                <td className="px-6 py-4 text-red-500">{formatNumber(asks?.[index]?.[1])}</td>
                <td className="px-6 py-4 text-red-500"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!bids?.length && (
        <div className="w-full h-[300px] justify-center items-center flex flex-col">
          <Empty className="w-[40px] h-[40px]" />
          No Data
        </div>
      )}
    </div>
  );
};

export default OrderBooks;

//price -0 
//amount- 1
