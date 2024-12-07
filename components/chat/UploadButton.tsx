import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {Button} from '@/components/ui/button'
import { Paperclip } from 'lucide-react';
interface UploadButtonProps {
    onClick: () => void;
    tooltip: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onClick, tooltip }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClick}>
                    <Paperclip className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
