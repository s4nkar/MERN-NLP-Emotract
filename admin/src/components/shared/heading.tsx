import { cn } from "@/lib/utils";

type THeadingProps = {
  title: string;
  description?: string;
  className?: string;
  flaggedCount?: string;
  messageCount?: string;
  processingMessagesCount?: number;

};

export default function Heading({
  title,
  description,
  className,
  messageCount,
  flaggedCount,
  processingMessagesCount,
}: THeadingProps) {
  return (
    <div className={cn(className, 'flex justify-start items-center gap-2')}>
      <h2 className="text-xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h2> 
      (<div>
        <span>{messageCount} Messages</span>
        <span>, {flaggedCount} Flagged</span>
        <span>{processingMessagesCount || 0 > 0 ? (`, ${processingMessagesCount} Processing`) : "" }</span>
      </div>)
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
