import FilesInteractor from '../interactor/FileInteractor/Files';
import { createCloudinaryStorageBucketAdapter, FilesFormat } from './IBucketAdapter';

export async function createBucketAdapter() {
  return createCloudinaryStorageBucketAdapter();
}

export type TUploadFiles = ({ files, format, vendorId }: {
  files: Buffer[];
  format?: FilesFormat.JPEG;
  vendorId?: string;
}) => Promise<string[]>

export const uploadFiles: TUploadFiles = async ({ files, format = FilesFormat.JPEG, vendorId = 'psk' }) => {
  const bucketAdapter = await createBucketAdapter();
  const filesInteractor = new FilesInteractor(bucketAdapter);

  return filesInteractor.uploadFiles({
    files,
    format,
    refNo: crypto.randomUUID(),
    vendorId,
  });
}