import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UploadControls } from "./UploadControls";

interface ChatInputProps {
  value: string;
  userId: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (files: FileList) => Promise<void>;
  onError?: (error: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                      value,
                                                      userId,
                                                      onChange,
                                                      onSend,
                                                      onFileUpload,
                                                      onError
                                                    }) => {
  return (
      <div className="border-t p-4">
        <div className="relative rounded-lg border bg-background">
          {/* Model and Style Selectors */}
          {/*<div className="flex items-center gap-2 border-b px-3 py-2">*/}
          {/*  <Select defaultValue="claude-3">*/}
          {/*    <SelectTrigger className="w-[200px] border-0">*/}
          {/*      <SelectValue placeholder="Select Model" />*/}
          {/*    </SelectTrigger>*/}
          {/*    <SelectContent>*/}
          {/*      <SelectItem value="claude-3">Adam</SelectItem>*/}
          {/*      <SelectItem value="claude-2">Eve</SelectItem>*/}
          {/*    </SelectContent>*/}
          {/*  </Select>*/}

          {/*  <Separator orientation="vertical" className="h-6" />*/}

          {/*  <Select defaultValue="normal">*/}
          {/*    <SelectTrigger className="w-[150px] border-0">*/}
          {/*      <div className="flex items-center gap-2">*/}
          {/*        <span className="text-muted-foreground">Choose style</span>*/}
          {/*        <ChevronDown className="h-4 w-4" />*/}
          {/*      </div>*/}
          {/*    </SelectTrigger>*/}
          {/*    <SelectContent>*/}
          {/*      <SelectItem value="normal">Normal</SelectItem>*/}
          {/*      <SelectItem value="creative">Creative</SelectItem>*/}
          {/*      <SelectItem value="precise">Precise</SelectItem>*/}
          {/*    </SelectContent>*/}
          {/*  </Select>*/}
          {/*</div>*/}

          {/* Message Input */}
          <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Message Claude..."
              className="min-h-[100px] border-0 focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
          />

          {/* Upload Controls and Keyboard Hint */}
          <div className="flex items-center justify-between border-t p-2">
            <UploadControls
                multiple={true}
                userId={userId}
                onFileUpload={onFileUpload}
                onError={onError}
            />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Use</span>
              <kbd className="rounded border px-2 py-0.5">shift + return</kbd>
              <span>for new line</span>
            </div>
          </div>
        </div>
      </div>
  );
};