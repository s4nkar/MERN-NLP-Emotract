import { cn } from "@/lib/utils";

type THeadingProps = {
  title: string;
  description?: string;
  className?: string;
  flaggedCount: string;
  messageCount: string;

};

export default function Heading({
  title,
  description,
  className,
  messageCount,
  flaggedCount
}: THeadingProps) {
  return (
    <div className={cn(className, 'flex justify-start items-center gap-2')}>
      <h2 className="text-xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h2> (<span>{messageCount} Messages, {flaggedCount} Flagged</span>)
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
