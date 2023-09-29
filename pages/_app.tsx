import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import FilterSidebar from "../Components/FilterSidebar"


const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState<Boolean>(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    // NAVBAR
    // FilterSidebar

    <div className="text-3xl font-bold underline ">
      hello world app se
      <FilterSidebar />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
