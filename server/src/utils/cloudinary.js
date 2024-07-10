import { v2 as cloudinary } from "cloudinary";

export default async function uploadImageToCloudinary(imagePath) {
  // Configuration
  cloudinary.config({
    cloud_name: "djt4dmzca",
    api_key: "625629949359939",
    api_secret: "-lxJKq9ZJIga3HWoHU5iJ8xzz_4", // Click 'View Credentials' below to copy your API secret
  });

  // Upload an image
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: `${Math.floor(Math.random() * 100 + 1)}`,
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary image upload failed with error: " + error);
    throw error;
  }
}
