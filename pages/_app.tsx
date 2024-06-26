import type {AppProps} from "next/app";
import Head from "next/head";
import {useEffect, useState} from "react";
import Navbar from "../components/layouts/Navbar";
import {Footer} from "../components/layouts/Footer";
import {ToastContainer} from "react-toastify";
import {useRouter} from "next/router";
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import {persistor, rootStore} from "../app/store";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import {PlatformInit} from "../features/evaluators/PlatformInit";

const MyApp = ({Component, pageProps}: AppProps) => {
  const [isSSR, setIsSSR] = useState<Boolean>(true);
  const router = useRouter();
  const isACDLaddersPage: boolean = router.pathname === "/";
  const titleName: string = `${
    isACDLaddersPage ? "Ladders" : "CF Filter"
  } | ACD`;

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
      <Head>
        <title>{titleName}</title>
        <link rel="icon" href="app-logo.png" type="image/png" sizes="any" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v6.1.1/css/all.css"
          integrity="sha384-/frq1SRXYH/bSyou/HUp/hib7RVN1TawQYja658FEOodR/FQBKVqT9Ol+Oz3Olq5"
          crossOrigin="anonymous"
        />
      </Head>

      <Provider store={rootStore}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer autoClose={1200} limit={3} draggablePercent={30} />
          <PlatformInit>
            <Navbar />
            <div>
              <Component {...pageProps} />
            </div>
            <Footer />
          </PlatformInit>
        </PersistGate>
      </Provider>
    </>
  );
};

export default MyApp;
