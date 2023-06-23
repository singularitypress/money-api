import React, { MouseEventHandler, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "normal" | "danger";
}

export const Button: React.FC<Props> = ({
  children,
  onClick,
  variant = "normal",
}) => {
  const classMap = {
    normal:
      "bg-gray-800 border border-gray-800 hover:bg-white hover:text-gray-800 text-white",
    primary:
      "bg-blue-500 border border-blue-500 hover:bg-white hover:text-blue-500 text-white",
    danger:
      "bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 text-white",
  };
  return (
    <button
      onClick={onClick}
      className={[
        "transition-all ease-in-out duration-300 font-bold py-2 px-4 rounded",
        classMap[variant],
      ].join(" ")}
    >
      {children}
    </button>
  );
};
