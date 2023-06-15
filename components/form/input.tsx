import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface Props {
  label: string;
  description?: string;
  placeholder?: string;
  name: string;
  value: number | string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  step?: number;
}

export const Input = ({
  label,
  description,
  placeholder,
  type,
  name,
  value,
  onChange,
  step,
}: Props) => {
  return (
    <div className="w-full">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        id={name}
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        step={step}
      />
      {description && (
        <p className="text-gray-600 text-xs italic">{description}</p>
      )}
    </div>
  );
};
