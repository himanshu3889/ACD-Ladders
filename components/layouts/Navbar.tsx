import React from "react";
import UserSearch from "../UserSearch";
import UserDetails from "../UserDetails";
import AppLogo from "../../public/app-logo.png";
import Image from "next/image";
import {useRouter} from "next/router";
import Link from "next/link";
import {BASE_URL, PLATFORMS} from "../../configs/constants";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../app/store";
import {IUserSlice} from "../../features/user/userSlice";

const Navbar = () => {
  const router = useRouter();
  const userState: IUserSlice = useSelector(
    (state: IRootReducerState) => state.user
  );
  const isLoadingProblems: boolean = useSelector(
    (state: IRootReducerState) => state.problems.isLoading
  );
  const allowedPaths = ["/", "/cf_filter"]
  const path = router.pathname
  const showUserSearch = allowedPaths.includes(path)
  const platform: PLATFORMS = useSelector(
    (state: IRootReducerState) => state.problems.platform
  );

  const handleChangePlatform = () => {
    if (platform === PLATFORMS.ACD) {
      router.push(`${BASE_URL}/cf_filter`);
    } else {
      router.push(`${BASE_URL}/`);
    }
  };

  const isProfileShow: boolean = userState.profile !== null;
  // &&
  // !userState.isLoadingProfile &&
  // !userState.isLoadingSubmissions;

  return (
    <div className="w-full overflow-auto bg-gray-700 body-font mb-0.5 shadow-sm border-1.5 border-white">
      <div className="mx-1 flex justify-between items-center py-2 px-2">
        <div className="flex items-center justify-center">
          <div className="md:border-r md:border-gray-500 md:pr-2 mx-2 flex flex-shrink-0 title-font font-medium items-center text-gray-900 md:mb-0">
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
                    borderWidth: !isLoadingProblems ? "2px" : "",
                    borderColor: !isLoadingProblems ? "white" : "",
                  }}
                />
                {isLoadingProblems && (
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

            <span className="hidden lg:inline-block ml-3 text-base text-gray-100 font-semibold antialiased">
              A Code Daily!
            </span>
          </div>
          <button
            type="button"
            onClick={handleChangePlatform}
            className="bg-orange-500 flex items-center text-white text-xs font-bold rounded p-1 mr-4"
          >
            {platform === PLATFORMS.ACD ? (
              <div className="flex flex-col items-center">
                <div>CF</div>
                <div>Filter</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div>ACD</div>
                <div>Ladders</div>
              </div>
            )}
            <i className="fa-solid fa-chevron-right pl-1"></i>
          </button>
        </div>

        {showUserSearch && (
          <div className="flex md:flex-row-reverse items-center">
            <UserSearch />
            {isProfileShow && <UserDetails />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
