// Enum attribute for image sizes
export enum ImageSizeKey {
  PROFILE = 'PROFILE',
  CARD = 'CARD',
  POST = 'POST'
}

export const ImageSizePresets: Record<ImageSizeKey, { width: number; height: number }> = {
  [ImageSizeKey.PROFILE]: { width: 150, height: 150 },
  [ImageSizeKey.CARD]: { width: 300, height: 200 },
  [ImageSizeKey.POST]: { width: 800, height: 600 }
};
