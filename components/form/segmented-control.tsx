import { MouseEventHandler } from "react";

interface Props {
  options: string[];
  value: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const SegmentedControl = ({
  options,
  value,
  onClick,
  className,
}: Props) => {
  return (
    <div className={[className, "bg-gray-800 p-4 w-fit rounded-md"].join(" ")}>
      {options.map((option, index) => (
        <button
          key={option}
          value={option}
          onClick={onClick}
          className={[
            "px-4 py-2 rounded-l-md rounded-r-md",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white",
            "transition ease-in-out duration-150",
            value === option
              ? "bg-white text-gray-900"
              : "bg-gray-800 text-white hover:bg-gray-700",
            index === 0 ? "rounded-l-md" : "",
            index === options.length - 1 ? "rounded-r-md" : "",
          ].join(" ")}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
