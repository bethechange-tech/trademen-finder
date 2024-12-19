import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import IBucketAdapter from '../IBucketAdapter';

export enum FilesFormat {
  PDF = 'pdf',
  PNG = 'png',
  JPEG = 'jpeg',
}

export default class BucketAdapter implements IBucketAdapter {
  private readonly s3: S3Client;

  private readonly bucketName: string;

  private static readonly contentTypeMap: Record<FilesFormat, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpeg: 'image/jpeg',
  };

  constructor(s3: S3Client, bucketName: string) {
    this.s3 = s3;
    this.bucketName = bucketName;
  }

  getObjectsByPrefixAndContentType(prefix?: string, extension?: FilesFormat): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  async upload(data: string | Buffer, fileName: string, extension: FilesFormat): Promise<string> {
    console.info({ message: `Uploading ${fileName} to S3 bucket` });

    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${fileName}.${extension}`,
      Body: typeof data === 'string' ? Buffer.from(data, 'base64') : data,
      ContentType: BucketAdapter.contentTypeMap[extension],
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);

    console.info({
      message: `Successfully uploaded ${fileName}.${extension} to S3 bucket ${this.bucketName}`,
    });

    const generatedUrl = `https://ypphzcgzihluwhwjcnix.supabase.co/storage/v1/object/public/${this.bucketName}/${`${fileName}.${extension}`}`;

    return generatedUrl
  }

}
