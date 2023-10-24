import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.css";


const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState<Boolean>(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
      <Head>
        <title>CF Filter</title>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v6.1.1/css/all.css"
          integrity="sha384-/frq1SRXYH/bSyou/HUp/hib7RVN1TawQYja658FEOodR/FQBKVqT9Ol+Oz3Olq5"
          crossOrigin="anonymous"
        />
      </Head>
      
      {/* NAVBAR  */}
      <div>
        <Component {...pageProps} />
      </div>
      {/* Footer */}
    </>
  );
};

export default MyApp;
