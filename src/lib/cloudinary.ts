import { v2 as cloudinary, SignApiOptions, UploadApiResponse } from 'cloudinary'


cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECREY_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

const uploadFile = async (data: string | Buffer, mimetype = 'image/png') => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${mimetype};base64,${data}`, {
                
            }
        )

        cloudinary.uploader.unsigned_upload

        return result.public_id
    } catch (error) {
        console.log(error)
        return ''
    }
}
export async function uploadFileNew(file: File, signApiUrl: string) {
    const timestamp = Date.now();
    const formData = new FormData();
    const parameters: SignApiOptions = {};
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadsFolder = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER;
  
    if (!cloudName) {
      throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    }
  
    if (uploadsFolder) {
      parameters.folder = uploadsFolder;
    }
  
    Object.keys(parameters)
      .sort()
      .forEach(key => {
        if (typeof parameters[key] === "undefined") return;
        formData.append(key, String(parameters[key]));
      });
  
    const { signature } = await fetch(signApiUrl, {
      method: "POST",
      body: JSON.stringify({
        ...parameters,
        timestamp: String(timestamp),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(r => r.json());
  
    if (!signature) {
      throw new Error("Failed to sign the request");
    }
  
    formData.append("file", file);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append(
      "api_key",
      String(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    );
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error.message || "Uknown error");
    }
  
    const results: UploadApiResponse = await response.json();
  
    return results;
  }

export {
    cloudinary,
    uploadFile
}