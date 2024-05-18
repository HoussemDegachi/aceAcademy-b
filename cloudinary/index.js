import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const uploadImage = async (imagePath, folder) => {

    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      folder
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result
    } catch (error) {
        console.error(error);
        return null
    }
};

export default uploadImage