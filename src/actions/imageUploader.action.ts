'use server';

import env from '@/app/env';
import { ImageSizeKey, ImageSizePresets } from '@/constants/imageUploaderConstants';
import { HttpError } from '@/utils/httpError';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

interface UploadImagePayload {
  file: File | null;
  tags?: string[];
  folder?: string;
  context?: string;
  sizeKeys?: ImageSizeKey[];
}

const uploadImage = async (payload: UploadImagePayload) => {
  if (!payload.file) {
    throw new HttpError(400, 'No image provided');
  }

  try {
    // Convert file to buffer
    const arrayBuffer = await payload.file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Generate eager transforms only if provided
    const eager = payload.sizeKeys?.map((key) => {
      const { width, height } = ImageSizePresets[key];
      return {
        width,
        height,
        crop: 'fit' as const
        // quality: 'auto' as const,
        // format: 'auto' as const
      };
    });

    // Build options object dynamically
    const options: Record<string, any> = {};
    if (payload.tags) options.tags = payload.tags;
    if (payload.folder) options.folder = payload.folder;
    if (eager && eager.length > 0) options.eager = eager;
    if (payload.context) options.context = payload.context;

    // Upload image
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result as UploadApiResponse);
        })
        .end(buffer);
    });

    return response;
  } catch (error) {
    console.error('Image Server error :: ', error);
    throw error;
  }
};

export default uploadImage;
