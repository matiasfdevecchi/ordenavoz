import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import Controller from "./controller";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
    forcePathStyle: true,
    credentials: {
        secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
    },
    endpoint: process.env.AWS_ENDPOINT || '',
    region: process.env.AWS_REGION || '',
});

export const uploadFileController: (bucket: string, folderName: string) => Controller = (bucket: string, folderName: string) => {
    return async (req, res) => {
        const image = (req.files as Express.Multer.File[])[0];
        const filename = `${Date.now().toString()}-${image.originalname}`;
        const fileKey = `${folderName}/${filename}`;
        const uploader = new Upload({
            client: s3Client,
            params: {
                Bucket: bucket,
                Key: fileKey,
                Body: image.buffer,
                ACL: 'public-read',
            }
        });

        await uploader.done();

        res.status(200).json({
            success: 1,
            file: {
                url: `${process.env.AWS_CDN_URL || ''}/${fileKey}`,
            }
        });
    }
}