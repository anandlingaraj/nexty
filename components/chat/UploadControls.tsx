// components/chat/upload/UploadControls.tsx
import { useRef, useState } from "react";
import { UploadButton } from "./UploadButton";
import { FileInput } from "./FileInput";

interface UploadControlsProps {
  userId: string;
  onFileUpload: (files: FileList) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
}

interface PresignedUrlFields {
  [key: string]: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  fields: PresignedUrlFields;
}
export const UploadControls: React.FC<UploadControlsProps> = ({
  userId,
  onFileUpload,
                                                                multiple,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const connectionsResponse = await fetch(`/users/${userId}/connections`);
      const connections = await connectionsResponse.json();

      const s3Connection = connections.find((conn: any) => conn.type === "s3");
      if (!s3Connection) {
        throw new Error("No S3 connection configured");
      }

      const presignedResponse = await fetch(
        `/aws_stores/users/${userId}/connections/${s3Connection.id}/signedUrl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            folder: `${userId}/chat-uploads`,
          }),
        },
      );

      if (!presignedResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fields, fileUrl }: PresignedUrlResponse =
        await presignedResponse.json();

      // 4. Upload to S3
      const formData = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      onFileUpload(fileUrl, file.name);
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileInput multiple ref={fileInputRef} onChange={handleFileChange} accept="*" />

      <UploadButton
        onClick={() => fileInputRef.current?.click()}
        tooltip="Upload File"
      />

      {uploading && (
        <div className="text-sm text-muted-foreground">Uploading...</div>
      )}
    </div>
  );
};
