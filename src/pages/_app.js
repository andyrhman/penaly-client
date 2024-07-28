import Layout from '../components/Layout';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { configStore } from '../redux/configureStore';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.css";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
axios.defaults.withCredentials = true;

const store = configStore();

function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Layout>
        <ToastContainer />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
