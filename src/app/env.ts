const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    apiKey: String(process.env.APPWRITE_API_KEY)
  },
  cloudinary: {
    cloudName: String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
    apiKey: String(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY),
    apiSecret: String(process.env.CLOUDINARY_API_SECRET),
    uploadPreset: String(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  },
  resend: {
    apiKey: String(process.env.RESEND_API_KEY)
  }
};

export default env;
