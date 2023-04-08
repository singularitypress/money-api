/**
 * @name MultiSelect
 * @description MultiSelect component using tailwindcss that allows the user to select multiple options from a list.
 * @param {string[]} options - The list of options to select from.
 * @param {string[]} selectedOptions - The list of options that are currently selected.
 * @param {Dispatch<SetStateAction<string[]>>} setSelectedOptions - The function to update the selected options.
 */
import { SetStateAction, Dispatch } from "react";

interface Props {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

export const MultiSelect = ({
  options,
  selectedOptions,
  setSelectedOptions,
}: Props) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2">Select Payees</label>
      <div className="flex flex-col">
        {options.map((option) => (
          <div key={option}>
            <input
              type="checkbox"
              id={option}
              name={option}
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedOptions([...selectedOptions, e.target.value]);
                } else {
                  setSelectedOptions(
                    selectedOptions.filter(
                      (option) => option !== e.target.value,
                    ),
                  );
                }
              }}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
