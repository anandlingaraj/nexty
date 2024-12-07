import React, { forwardRef } from "react";

interface FileInputProps {
    ref: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    multiple? : boolean
}

export const FileInput = forwardRef <HTMLInputElement, FileInputProps>(({ onChange, accept = "*", multiple }, ref) => (
    <input
        type="file"
        multiple={multiple}
        ref={ref}
        className="hidden"
        onChange={onChange}
        accept={accept}
    />
));