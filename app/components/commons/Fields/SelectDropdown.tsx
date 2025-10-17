"use client";

import { Fragment } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

type Option = { label: string; value: string };

type SelectDropdownProps = {
    options: Option[];
    value: Option;
    onChange: (value: Option) => void;
    className?: string;
    disabled?: boolean;
};

export default function SelectDropdown({
  options,
  value,
  onChange,
  className = "w-40",
}: SelectDropdownProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className={`relative cursor-default rounded-xl border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 text-sm ${className}`}
        >
          <span className="block truncate">{value.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
          </span>
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-70 w-full overflow-auto rounded-xl bg-white border border-gray-200 py-1 text-sm shadow-lg focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-yellow-100 text-yellow-700" : "text-gray-700"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-2 flex items-center text-yellow-600">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
