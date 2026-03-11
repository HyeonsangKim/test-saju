import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

export function PrimaryButton({
  children,
  className,
  disabled,
  loading,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 h-11 md:h-12 rounded-full px-6 md:px-8 font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
