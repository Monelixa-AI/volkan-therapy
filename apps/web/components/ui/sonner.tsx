"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-gray-900 border border-gray-200 shadow-lg",
          description: "text-gray-600",
          actionButton: "bg-primary-500 text-white",
          cancelButton: "bg-gray-100 text-gray-900"
        }
      }}
      {...props}
    />
  );
}
