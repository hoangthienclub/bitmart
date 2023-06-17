const Tabs = ({ onChange, value }: { onChange: (key: number) => void; value: number }) => {
  return (
    <>
      <div className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        <div
          onClick={() => onChange(0)}
          className={`${
            value === 0 ? "dark:bg-gray-400" : "dark:bg-gray-700"
          } inline-block w-full cursor-pointer p-4  rounded-l-lg focus:ring-4 focus:ring-blue-300  focus:outline-none  dark:text-white`}
          aria-current="page">
          Buy
        </div>
        <div
          onClick={() => onChange(1)}
          className={` ${
            value === 1 ? "dark:bg-gray-400" : "dark:bg-gray-700"
          } inline-block w-full cursor-pointer p-4 rounded-r-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:text-white `}>
          Created volume
        </div>
      </div>
    </>
  );
};

export default Tabs;
