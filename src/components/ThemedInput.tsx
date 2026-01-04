// src/components/ThemedInput.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "small" | "large";
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

export const ThemedInput = forwardRef<HTMLInputElement, ThemedInputProps>(
  (
    {
      variant = "default",
      fullWidth = false,
      error = false,
      helperText,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      // Базовые стили
      "border rounded transition-all duration-200 outline-none",
      // Светлая тема
      "bg-white text-black border-gray-300 placeholder-gray-500",
      // Темная тема
      "dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400",
      // Фокус
      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      "dark:focus:ring-blue-400 dark:focus:border-blue-400",
      // Состояние ошибки
      error &&
        "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400",
      // Hover эффект
      "hover:border-gray-400 dark:hover:border-gray-500",
    ]
      .filter(Boolean)
      .join(" ");

    const variantClasses = {
      small: "px-2 py-1 text-sm",
      default: "px-3 py-2 text-base",
      large: "px-4 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClassName = [
      baseClasses,
      variantClasses[variant],
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col">
        <input ref={ref} className={combinedClassName} {...props} />
        {helperText && (
          <span
            className={`mt-1 text-sm ${
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = "ThemedInput";
