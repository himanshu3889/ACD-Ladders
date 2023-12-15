import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import Navbar from "../Components/Navbar";
import { Footer } from "../Components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState<Boolean>(true);
  const router = useRouter();
  const isACDLaddersPage : boolean = router.pathname === "/";
  const titleName: string = `${isACDLaddersPage ? "Ladders" : "CF Filter"} | ACD`;

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
      <Head>
        <title>{titleName}</title>
        <link
          rel="icon"
          href="app-logo.png"
          type="image/png"
          sizes="any"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v6.1.1/css/all.css"
          integrity="sha384-/frq1SRXYH/bSyou/HUp/hib7RVN1TawQYja658FEOodR/FQBKVqT9Ol+Oz3Olq5"
          crossOrigin="anonymous"
        />
      </Head>

      <ToastContainer autoClose={1200} limit={3} draggablePercent={30} />
      <Navbar />
      <div>
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  );
};

export default MyApp;
