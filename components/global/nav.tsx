/**
 * @name Nav
 * @description A responsive navigation component using tailwindcss that displays the current page and a list of links to other pages.
 */

import Link from "next/link";
import { useState } from "react";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const links: {
    [key: string]: string;
  } = {
    Spending: "/spending",
    "Spending Comparisons": "/spending-comparisons",
    Payroll: "/payroll",
    "Mortgage Stats": "/mortgage-stats",
    Saving: "/saving",
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6 w-full fixed z-50">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Budgeting</span>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={toggle}
          className="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 8a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
      >
        <ul className="text-sm lg:flex-grow">
          {Object.keys(links).map((link) => (
            <Link
              key={link}
              href={links[link]}
              className="block font-bold lg:inline-block lg:mt-0 text-gray-200 border-2 border-transparent border-dotted hover:border-b-gray-200 mr-4"
            >
              {link}
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
};
