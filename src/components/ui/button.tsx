import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", secondary: "border border-border bg-background text-foreground hover:bg-muted", outline: "border border-border bg-background text-foreground hover:bg-muted", ghost: "text-muted-foreground hover:bg-muted hover:text-foreground", danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90", destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-11", sm: "h-9 min-h-9 px-3 text-xs", lg: "h-12 px-6", icon: "size-11 px-0" } },
  defaultVariants: { variant: "default", size: "default" },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Component = asChild ? Slot : "button";
  return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";