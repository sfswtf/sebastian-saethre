import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = "Button", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full border px-6 py-3 text-center font-semibold transition-colors",
          "hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400",
          className,
        )}
        {...props}
      >
        <div className="relative z-10 flex items-center gap-2">
          <span>{text}</span>
          <span className="opacity-0 transition-all duration-300 group-hover:opacity-100">
            <ArrowRight size={18} />
          </span>
        </div>
        <span className="absolute inset-0 w-0 bg-white/15 transition-all duration-300 group-hover:w-full" />
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
