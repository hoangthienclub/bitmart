
import { useRef, useState } from "react";
import { ISymbol } from "../../interface";
import useOnClickOutside from "../../hooks/useClickOutside";

const SearchInput = ({
  onChange,
  value,
  onSelectSymbol,
  dataSearch
}: {
  onChange: (value: any) => void;
  value: string;
  onSelectSymbol: (it: ISymbol) => void;
  dataSearch: ISymbol[]
}) => {
  const wrapperRef = useRef(null);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);

  useOnClickOutside(wrapperRef, () => {
    setIsShowSearchResult(false);
  });

  return (
    <div className=" w-[400px]" ref={wrapperRef}>
      <div className="relative w-[400px]">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
            
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          onFocus={() => setIsShowSearchResult(true)}
          onChange={onChange}
          value={value}
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search symbol"
        />
      </div>
      {isShowSearchResult && <div className="absolute z-10 mt-2 w-[400px] max-h-[400px] overflow-auto bg-white rounded-lg shadow dark:bg-gray-700">
        {dataSearch?.map((it: ISymbol, index: number) => {
          return (
            <div
              key={index}
              onClick={() => {
                setIsShowSearchResult(false);
                onSelectSymbol(it);
              }}>
              <div className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                {it?.symbol}
              </div>
            </div>
          );
        })}
      </div>
      }
    </div>
  );
};

export default SearchInput;
