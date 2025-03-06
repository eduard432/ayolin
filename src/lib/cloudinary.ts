import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECREY_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

const uploadFile = async (data: string | Buffer, mimetype = 'image/png') => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${mimetype};base64,${data}`
        )

        return result.public_id
    } catch (error) {
        console.log(error)
        return ''
    }
}

export {
    cloudinary,
    uploadFile
}