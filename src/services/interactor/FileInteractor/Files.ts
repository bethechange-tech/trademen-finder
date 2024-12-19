import { generateInvoiceFileName } from './FilesUtils';
import { IIFilesInteractor, FileOrderLine } from './Interfaces';
import { FilesFormat } from '../../adapters/BucketAdapter/BucketAdapter';
import IBucketAdapter from '../../../services/adapters/IBucketAdapter';

/**
 * Interactor for creating and updating print Files
 */
export default class FilesInteractor implements IIFilesInteractor {
  private bucketAdapter: IBucketAdapter;

  constructor(bucketAdapter: IBucketAdapter) {
    this.bucketAdapter = bucketAdapter;
  }

  /**
   * Given a list of files uploads to S3
   *
   * @async
   * @param arg.files List of files
   * @param arg.format FilesFormat enum value (PDF | PNG | JPEG)
   * @param arg.refNo the invoice no returned by carrier integration
   * @param arg.vendorId the vendor id associated with these files - used for generating the file path
   * @returns void
   **/
  public async uploadFiles({
    files,
    format,
    refNo,
    vendorId,
  }: {
    files: string[] | Buffer[];
    format: FilesFormat;
    refNo: string;
    vendorId: string;
  }): Promise<string[]> {
    return Promise.all(
      files.map((file: string | Buffer, i: number) => {
        const pageNumber = files.length > 1 ? i + 1 : null;
        const fileName = generateInvoiceFileName(refNo, vendorId, pageNumber);

        return this.bucketAdapter.upload(file, fileName, format);
      })
    );
  }

  /**
   * Fetches previously generated Files for given purchase order and reference number
   * @async
   * @param companyId
   * @param FileOrderLine
   * @returns list of Files
   */
  public async fetchFiles(companyId: number, FileOrderLine: FileOrderLine): Promise<string[]> {
    console.info({ companyId, FileOrderLine });
    // const { referenceNo, format } = FileOrderLine;

    // const refNo = await this.transactionRepository.getOrderLinePropertyValue(
    //   referenceNo,
    //   CompanyInvoiceProperty.INVOICE,
    // );

    // if (!refNo) {
    //   const errorMessage = 'Unable to find invoice number';
    //   logger.error({ message: errorMessage, data: {  FileOrderLine } });
    //   throw new Error(errorMessage);
    // }

    // const vendorId = await this.companyRepository.getVendorIdBycompanyId(companyId);

    // const prefix = generateInvoiceFileName(refNo, vendorId);
    // const objects = await this.bucketAdapter.getObjectsByPrefixAndContentType(prefix, format);

    // if (!objects.length) {
    //   const errorMessage = 'Unable to find previously printed Files';
    //   const error = new Error(errorMessage);

    //   logger.error({ message: errorMessage, data: {  error, FileOrderLine } });
    //   throw error;
    // }

    // return objects;
    return [];
  }
}
