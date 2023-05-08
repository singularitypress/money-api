import React, { ReactNode } from "react";

/**
 * @description A tailwindcss centered container component, with padding.
 * @param children The children to render inside the container.
 * @returns A centered container component.
 */
export const Container = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center">
    <div className="container px-4">{children}</div>
  </div>
);
