import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
interface S3BucketButtonProps {
  onClick: () => void;
  iconSrc: string;
}

export const S3BucketButton: React.FC<S3BucketButtonProps> = ({
  onClick,
  iconSrc,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick}>
          <img className="h-5 w-5" src={iconSrc} alt="s3" height={50} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>S3 Bucket</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
