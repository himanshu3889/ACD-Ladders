import React from "react";
import Link from "next/link";
import { BASE_URL } from "./ProblemsSidebar";


export const Footer = () => {
  return (
    <div className="w-full mx-auto">
      <footer className="p-3 rounded shadow flex items-center justify-between md:p-3 bg-gray-800">
        <div>
          <span className="text-sm text-gray-500 hover:text-gray-300 text-center px-2 border-r">
            @ ACD Team <i className="fa-solid fa-heart text-red-600"></i>
          </span>
          <Link href={`${BASE_URL}/about`} legacyBehavior>
            <a
              target="_blank"
              className="text-sm text-gray-500 hover:text-gray-300 text-center mx-2"
            >
              About Us
            </a>
          </Link>
        </div>
        <ul className="flex flex-wrap items-center">
          <li>
            <Link href="https://discord.gg/ymBgMYvJb4" legacyBehavior>
              <a
                target="_blank"
                className="mr-4 text-sm text-gray-500 md:mr-8 "
              >
                <i className="fa-brands fa-discord text-white hover:text-blue-400 text-2xl"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://www.youtube.com/@GrindCoding" legacyBehavior>
              <a
                target="_blank"
                className="mr-4 text-sm text-gray-500 md:mr-8 "
              >
                <i className="fa-brands fa-youtube text-white hover:text-red-400 text-2xl"></i>
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/himanshu3889/ACodeDaily/" legacyBehavior>
              <a
                target="_blank"
                className="mr-4 text-sm text-gray-500 md:mr-8 "
              >
                <i className="fa-brands fa-github text-white hover:text-gray-400 text-2xl"></i>
              </a>
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};
