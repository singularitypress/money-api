/**
 * @component Modal
 * @description A modal component using tailwindcss that holds a passed in child component, animates in and out, and has a close button.
 */

import React, { Dispatch, ReactNode, SetStateAction } from "react";

export const Modal = ({
  children,
  toggleVisibility,
  visible,
}: {
  children: ReactNode;
  toggleVisibility: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}) => {
  return (
    <div
      className={`${
        visible
          ? "opacity-100 z-50 -translate-y-0"
          : "opacity-0 -z-50 -translate-y-4"
      } fixed inset-0 overflow-y-hidden transition-all duration-300 max-h-screen`}
    >
      <div className="flex items-end justify-center pt-4 px-4 py-8 pb-20 text-center sm:block sm:p-0 h-full">
        <div
          className="fixed inset-0 transition-all"
          aria-hidden="true"
          onClick={() => toggleVisibility(false)}
        >
          <div className="absolute inset-0 bg-gray-800 opacity-75 backdrop-blur-3xl"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className={[
            visible ? "opacity-100" : "opacity-0",
            "inline-block",
            "align-bottom",
            "bg-white",
            "rounded-lg",
            "text-left",
            "overflow-scroll",
            "max-h-full",
            "shadow-xl",
            "transform",
            "transition-all",
            "sm:align-middle",
            "max-w-3xl",
            "sm:w-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              {children}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={[
                "w-full",
                "inline-flex",
                "justify-center",
                "rounded-md",
                "border",
                "border-transparent",
                "shadow-sm",
                "px-4",
                "py-2",
                "bg-red-600",
                "text-base",
                "font-medium",
                "text-white",
                "hover:bg-red-700",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-offset-2",
                "focus:ring-red-500",
                "sm:ml-3",
                "sm:w-auto",
                "sm:text-sm",
              ].join(" ")}
              onClick={() => toggleVisibility(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
