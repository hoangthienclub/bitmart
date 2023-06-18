import Loading from "../Loading";

const Button = ({ loading = false, disabled = false, title, onClick }: { disabled?: boolean, title: string; onClick: () => void, loading?: boolean }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`${disabled ? 'dark:bg-gray-500 hover:border-gray-500' : 'dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 focus:ring-4  focus:ring-blue-300'} text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 `}>
      {loading ? <Loading /> : title}

    </button>
  );
};

export default Button;
