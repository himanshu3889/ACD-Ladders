import React from "react";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import useUserStore from "../store/User";
import ErrorAlert from "./ErrorAlert";
import AppLogo from "../utils/app-logo.png";
import Image from "next/image";

const Navbar = () => {
  const { userProfile, userError }: any = useUserStore();

  return (
    <header className="w-full overflow-auto bg-gray-700 body-font mb-0.5 shadow-sm border-1.5 border-white">
      <div className="mx-1 flex justify-between items-center py-2 px-4">
        <div className="flex items-center justify-center">
          <div className="md:border-r md:border-gray-500 pr-2 mx-4 md:mx-2 flex flex-shrink-0 title-font font-medium items-center text-gray-900 md:mb-0">
            <Image
              className="p-2 rounded-full"
              src={AppLogo}
              alt="logo"
              width={45}
              height={45}
              style={{
                borderWidth: "2px",
                borderColor: "white",
              }}
            />

            <span className="hidden md:inline-block ml-3 text-base text-gray-100 font-semibold antialiased">
              A Code Daily!
            </span>
          </div>
        </div>

        <div className="flex md:flex-row-reverse items-center justify-between">
          <UserForm />
          {userError !== null && <ErrorAlert message={userError} />}
          {userProfile && <UserDetails />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
