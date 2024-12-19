import { v2 as Cloudinary } from 'cloudinary';
import { S3Client } from '@aws-sdk/client-s3';
import BucketAdapter, { FilesFormat } from './BucketAdapter/BucketAdapter';
export { FilesFormat } from './BucketAdapter/BucketAdapter';
import BucketCloudinaryAdapter from './BucketCloudinaryAdapter/BucketAdapter';

const STORAGE_BUCKET_NAME = 'stashspot';

export type CloudinaryType = typeof Cloudinary;

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default interface IBucketAdapter {
  upload(data: string | Buffer, fileName: string, extension: FilesFormat): Promise<string>;
  getObjectsByPrefixAndContentType(prefix: string, extension: FilesFormat): Promise<string[]>;
}

// eslint-disable-next-line func-style
export function createStorageBucketAdapter(): BucketAdapter {
  console.info('createStorageBucketAdapter');

  // {
  //   apiVersion: '2006-03-01',
  //   accessKeyId: 'AKIAIOSFODNN7EXAMPLE', // Replace with your access key ID
  //   secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', // Replace with your secret access key
  //   endpoint: 'http://localhost:9444',
  //   s3ForcePathStyle: true, // Required for S3 Ninja
  //   signatureVersion: 'v4',
  // }

  return new BucketAdapter(
    new S3Client({
      forcePathStyle: true,
      region: 'eu-west-1',
      endpoint: 'https://ypphzcgzihluwhwjcnix.supabase.co/storage/v1/s3',
      credentials: {
        accessKeyId: 'cf591cc0a645907c5cbdda0a09fdcb91',
        secretAccessKey: 'b7d0df287b05a06c9af076e913473dd899bd294860a2c7d534abf615c6af8803'
      }
    }),
    STORAGE_BUCKET_NAME
  );
}

export function createCloudinaryStorageBucketAdapter(): BucketCloudinaryAdapter {
  console.info('createStorageBucketAdapter');
  return new BucketCloudinaryAdapter(Cloudinary, STORAGE_BUCKET_NAME);
}
