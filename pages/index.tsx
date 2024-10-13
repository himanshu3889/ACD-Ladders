// pages/home.tsx
import { GetServerSideProps } from "next";

const Home: React.FC = () => {
  return null; // Render nothing as we are redirecting
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/v2",
      permanent: false, // Set to true if the redirect is permanent
    },
  };
};

export default Home;
