import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();


const imagekit = new ImageKit ({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


async function uploadFile(buffer, fileName){
    const base64File = buffer.toString("base64")
    
    const result = await imagekit.upload({
        file: base64File, // required
        fileName: fileName, // required
        folder:"videos",
    })

   return result; // Return the URL of the uploaded file
}

export default {uploadFile}