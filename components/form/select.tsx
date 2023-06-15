import React, { ChangeEvent } from "react";
import ReactSelect, {
  ActionMeta,
  MultiValue,
  PropsValue,
  SingleValue,
} from "react-select";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";

interface Props extends StateManagerProps {
  label: string;
  description?: string;
}

export const Select = ({
  label,
  description,
  placeholder,
  name,
  options,
  onChange,
  isMulti,
  value,
}: Props) => {
  return (
    <div className="w-full">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <ReactSelect
        value={value}
        isMulti={isMulti}
        classNames={{
          control: () =>
            "appearance-none block w-full text-gray-700 border border-gray-300 rounded py-1 px-2 mb-3",
        }}
        onChange={onChange}
        placeholder={placeholder || label}
        options={options}
      />
      {description && (
        <p className="text-gray-600 text-xs italic">{description}</p>
      )}
    </div>
  );
};
