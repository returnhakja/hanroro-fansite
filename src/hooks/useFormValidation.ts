import { useState } from "react";

interface ValidationRules<T> {
  [key: string]: (value: T[keyof T]) => string | undefined;
}

export const useFormValidation = <T extends Record<string, any>>(
  rules: ValidationRules<T>
) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = (values: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(rules).forEach((key) => {
      const error = rules[key](values[key]);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
  };
};
