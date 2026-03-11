"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-zinc-50 text-slate-950 dark:bg-zinc-950 dark:text-white",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            `
            absolute inset-0 opacity-60 md:opacity-80
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_18%,var(--violet-300)_26%,var(--sky-300)_34%,var(--blue-400)_42%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[8px] md:blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0
            after:[background-image:var(--white-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed]
            after:mix-blend-difference
            `,
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_20%,transparent_80%)]"
          )}
        />
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
