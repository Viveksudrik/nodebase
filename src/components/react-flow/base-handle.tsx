import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

/**
 * Render a styled wrapper around the `Handle` component with baseline sizing and theme-aware classes.
 *
 * Forwards all received props to the underlying `Handle` and merges `className` with the default styling.
 *
 * @param className - Additional CSS class names to merge with the component's default classes
 * @param children - Elements to render inside the `Handle`
 * @returns The rendered `Handle` element with applied styling and forwarded props
 */
export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "dark:border-secondary dark:bg-secondary h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition",
        className,
      )}
    >
      {children}
    </Handle>
  );
}