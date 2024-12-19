import { UploadApiResponse } from 'cloudinary';
import IBucketAdapter, { CloudinaryType, FilesFormat } from '../IBucketAdapter';

export default class BucketAdapter implements IBucketAdapter {
  private readonly cloudinary: CloudinaryType;

  private readonly bucketName: string;

  constructor(cloudinary: CloudinaryType, bucketName: string) {
    this.cloudinary = cloudinary;
    this.bucketName = bucketName;
  }

  private async uploadToCloudinary(
    fileName: string,
    extension: string,
    data: Buffer
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: this.bucketName, public_id: `${fileName}.${extension}` },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            // Check if uploadResult is defined before resolving the promise
            if (uploadResult) {
              resolve(uploadResult);
            } else {
              reject(new Error('Upload result is undefined.'));
            }
          }
        }
      );

      uploadStream.end(data);
    });
  }
  async upload(data: string | Buffer, fileName: string, extension: FilesFormat): Promise<string> {
    console.info({ message: `Uploading ${fileName} to cloudinary bucket` });
    if (!Buffer.isBuffer(data)) throw new Error('file must be a buffer');

    const response = await this.uploadToCloudinary(fileName, extension, data);
    console.info({
      message: `Successfully uploaded ${fileName}.${extension} to cloudinary bucket ${this.bucketName}`,
    });
    return response.url;
  }

  /**
   * Fetches all objects which filename starts with the given prefix and the content type matches the given extension.
   * Returns an array of data urls encoded in base64.
   * @param prefix
   * @param extension
   */
  async getObjectsByPrefixAndContentType(
    prefix: string,
    extension: FilesFormat
  ): Promise<string[]> {
    console.log('----00----');
    console.log({ prefix, extension });
    console.log('====00====');
    return [''];
  }
}
