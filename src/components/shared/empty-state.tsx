import { cn } from "@/lib/utils";

export default function EmptyState({
  title,
  description,
  className,
  action,
}: {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border/60 bg-card/50 p-8 text-center text-sm backdrop-blur",
        className,
      )}
    >
      <div className="text-base font-semibold">{title}</div>
      {description ? <div className="mt-2 text-muted-foreground">{description}</div> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

