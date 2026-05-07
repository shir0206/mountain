import { useEffect, useRef, useState } from "react";

export interface UseLanguageDropdownReturn {
  isOpen: boolean;
  toggleDropdown: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  handleButtonKeyDown: (event: React.KeyboardEvent) => void;
}

export const useLanguageDropdown = (): UseLanguageDropdownReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);

  const handleButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    }
  };

  return {
    isOpen,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    dropdownRef,
    buttonRef,
    handleButtonKeyDown,
  };
};
