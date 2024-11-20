import { S3Client, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { IngredientImagesRepository } from "../core/domain/IngredientImagesRepository";
import { getImageFolder } from "../../../utils/image";

export class AwsIngredientImagesRepository implements IngredientImagesRepository {
    private s3Client: S3Client;
    private url = process.env.AWS_CDN_URL || '';
    private bucketName = process.env.AWS_INGREDIENT_BUCKET || '';

    constructor() {
        this.s3Client = new S3Client({
            forcePathStyle: true,
            credentials: {
                secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
            },
            endpoint: process.env.AWS_ENDPOINT || '',
            region: process.env.AWS_REGION || '',
        });
    }

    async save(prefix: string, image: Express.Multer.File): Promise<string> {
        try {
            const extension = image.originalname.split('.').pop() || '';
            const fileKey = `ingredient-images/${prefix}/${prefix}.${extension}`;

            const uploader = new Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucketName,
                    Key: fileKey,
                    Body: image.buffer,
                    ACL: 'public-read',
                }
            });

            await uploader.done();
            return `${this.url}/${fileKey}`;
        } catch (error) {
            throw error;
        }
    }

    async replace(previousPrefix: string, prefix: string, image: Express.Multer.File): Promise<string> {
        await this.remove(previousPrefix);
        return await this.save(prefix, image);
    }

    async remove(url: string): Promise<void> {
        const prefix = getImageFolder(url);

        try {
            const listParams = {
                Bucket: this.bucketName,
                Prefix: prefix,
            };

            let isTruncated = true;
            let continuationToken: string | undefined = undefined;

            while (isTruncated) {
                const listParamsWithToken: any = {
                    ...listParams,
                    ContinuationToken: continuationToken,
                };

                const listedObjects = await this.s3Client.send(new ListObjectsV2Command(listParamsWithToken));

                for (const object of listedObjects.Contents || []) {
                    await this.s3Client.send(new DeleteObjectCommand({
                        Bucket: this.bucketName,
                        Key: object.Key,
                    }));
                }

                isTruncated = listedObjects.IsTruncated ?? false;
                continuationToken = listedObjects.NextContinuationToken;
            }
        } catch (error) {
            console.error('Error while deleting files:', error);
            throw error;
        }
    }

    private async rollback(fileNames: string[]): Promise<void> {
        for (const fileName of fileNames) {
            const params = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileName
            });
            await this.s3Client.send(params);
        }
    }
}
