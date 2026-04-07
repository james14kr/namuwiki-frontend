import { cn } from "@/utils/tw.utils";

interface SectionCardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

const SectionCard = ({
  title,
  children,
  className,
  cardClassName,
}: SectionCardProps) => {
  return (
    <section className={className}>
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      <div
        className={cn(
          "rounded-xl border bg-card dark:bg-primary/10 px-6 py-5 shadow-sm",
          cardClassName
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionCard;
