import React from "react";
import UserSearch from "./UserSearch";
import UserDetails from "./UserDetails";
import useUserStore from "../store/User";
import AppLogo from "../public/app-logo.png";
import Image from "next/image";
import useProblemsStore from "../store/Problems";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar = () => {
  const { userProfile }: any = useUserStore();
  const { hasFetchingProblems }: any = useProblemsStore();
  const router = useRouter();
  const showUserSearch = !router.pathname.includes("/about");

  return (
    <header className="w-full overflow-auto bg-gray-700 body-font mb-0.5 shadow-sm border-1.5 border-white">
      <div className="mx-1 flex justify-between items-center py-2 px-4">
        <div className="flex items-center justify-center">
          <div className="md:border-r md:border-gray-500 pr-2 mx-4 md:mx-2 flex flex-shrink-0 title-font font-medium items-center text-gray-900 md:mb-0">
            <Link href="/">
              <div className="relative inline-block">
                <div aria-label="Loading..." role="status"></div>
                <Image
                  className="p-0.5 rounded-full"
                  src={AppLogo}
                  alt="logo"
                  width={45}
                  height={45}
                  style={{
                    borderWidth: !hasFetchingProblems ? "2px" : "",
                    borderColor: !hasFetchingProblems ? "white" : "",
                  }}
                />
                {hasFetchingProblems && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="animate-spin inline-block w-11 h-11 border-[2px] border-current border-t-transparent text-white rounded-full"
                      role="status"
                      aria-label="loading"
                    ></div>
                  </div>
                )}
              </div>
            </Link>

            <span className="hidden md:inline-block ml-3 text-base text-gray-100 font-semibold antialiased">
              A Code Daily!
            </span>
          </div>
        </div>

        {showUserSearch && (
          <div className="flex md:flex-row-reverse items-center justify-between">
            <UserSearch />
            {userProfile && <UserDetails />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
