import { useState, useCallback, ChangeEvent } from 'react';
import { toast } from 'sonner';
import uploadImage from '@/actions/imageUploader.action';
import { ImageSizeKey } from '@/constants/imageUploaderConstants';
import { HttpError } from '@/utils/httpError';

export interface UseImageUploadOptions {
  maxSizeMB?: number;
  acceptedTypes?: string[];
  sizeKeys?: ImageSizeKey[];
}

export interface UseImageUploadResult {
  file: File | null;
  previewUrl: string | null;
  uploading: boolean;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
  upload: () => Promise<string | null>;
}

export function useImageUpload({
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  sizeKeys = [ImageSizeKey.CARD]
}: UseImageUploadOptions = {}): UseImageUploadResult {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] ?? null;
      if (!selected) return;

      if (!acceptedTypes.includes(selected.type)) {
        toast.error('Please select a valid image file');
        return;
      }

      if (selected.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image size should be less than ${maxSizeMB}MB`);
        return;
      }

      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    },
    [acceptedTypes, maxSizeMB]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
  }, []);

  const upload = useCallback(async (): Promise<string | null> => {
    if (!file) return null;
    setUploading(true);
    try {
      const result = await uploadImage({ file, sizeKeys });
      if (result?.public_id) {
        toast.success('Image uploaded successfully');
        return result.public_id;
      }
    } catch (err: any) {
      const message = err instanceof HttpError ? err.message : 'Failed to upload image';
      toast.error(message);
      console.error(err);
    } finally {
      setUploading(false);
    }
    return null;
  }, [file, sizeKeys]);

  return {
    file,
    previewUrl,
    uploading,
    handleFileChange,
    removeFile,
    upload
  };
}
