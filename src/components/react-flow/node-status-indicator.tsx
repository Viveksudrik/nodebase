import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";
export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative h-full w-full">
      <div
        className={cn(
          "pointer-events-none absolute -inset-[3px] rounded-[inherit] border-[3px]",
          className
        )}
      />
      {children}
    </div>
  );
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative h-full w-full">
      <StatusBorder className="border-blue-500/20">{children}</StatusBorder>
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/60 backdrop-blur-[2px]">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-10 w-10 animate-ping rounded-full bg-blue-500/20" />
          <LoaderCircle className="size-6 animate-spin text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative h-full w-full">
      <div
        className={cn(
          "absolute -inset-[3px] overflow-hidden rounded-[inherit]",
          className
        )}
      >
        <div className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.5)_180deg,transparent_360deg)]" />
      </div>
      {children}
    </div>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  if (!status || status === "initial") return <>{children}</>;

  switch (status) {
    case "loading":
      return variant === "overlay" ? (
        <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>
      ) : (
        <BorderLoadingIndicator className={className}>
          {children}
        </BorderLoadingIndicator>
      );
    case "success":
      return (
        <StatusBorder className={cn("border-emerald-500/50", className)}>
          {children}
        </StatusBorder>
      );
    case "error":
      return (
        <StatusBorder className={cn("border-destructive/50", className)}>
          {children}
        </StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};
