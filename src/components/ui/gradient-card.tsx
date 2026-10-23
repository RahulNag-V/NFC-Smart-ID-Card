import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md border border-[#d9cdbd]",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-[#fffefb] via-[#fbf8f3] to-[#f4ede4]",
        gray: "bg-gradient-to-br from-[#fffefb] to-[#f0eae1]",
        purple: "bg-gradient-to-br from-[#fffefb] via-[#fbf8f3] to-[#ede5db]",
        green: "bg-gradient-to-br from-[#fffefb] via-[#f7f5ef] to-[#e8e2d8]",
        vintage: "bg-gradient-to-br from-[#fffefb] via-[#fbf8f3] to-[#f0eae1]",
        kraft: "bg-gradient-to-br from-[#fffefb] via-[#f5ede3] to-[#ebdcc9]",
      },
    },
    defaultVariants: {
      gradient: "vintage",
    },
  }
);

// Define the props interface for type safety and reusability
export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl?: string;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      gradient,
      badgeText,
      badgeColor,
      title,
      description,
      ctaText,
      ctaHref,
      imageUrl,
      ...props
    },
    ref
  ) => {
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.015, y: -2 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div className={cn(cardVariants({ gradient }), className)} {...props}>
          {/* Card Content */}
          <div className="z-10 flex flex-col h-full justify-between">
            <div>
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fbf8f3] border border-[#d9cdbd] px-3 py-1 text-xs font-medium text-[#2b241e] shadow-2xs w-fit">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: badgeColor }}
                />
                {badgeText}
              </div>

              {/* Title and Description */}
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2b241e] mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-[#73685c] leading-relaxed max-w-sm">
                  {description}
                </p>
              </div>
            </div>

            {/* Call to Action Link */}
            <a
              href={ctaHref}
              className="group mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#a67c52] hover:text-[#8e653e] transition-colors"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);

GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
