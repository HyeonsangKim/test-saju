import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function SectionCard({
  children,
  className,
  title,
  description,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm p-4 md:p-6",
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-medium text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
