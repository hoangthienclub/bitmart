import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './screens/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="dark" hideProgressBar={true} autoClose={3000} />
      <Home />
    </QueryClientProvider>
  );
}
export default App