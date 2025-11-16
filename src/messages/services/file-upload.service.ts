import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { config } from '@/config/configuration';

@Injectable()
export class FileUploadService {
  async uploadFile(dataBuffer: Buffer, fileName: string): Promise<string> {
    const s3 = this.getS3();
    const uploadResult = await s3
      .upload({
        Bucket: config.aws.bucketName,
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    const fileUrl = uploadResult.Location;

    return fileUrl;
  }

  async getPresignedUrl(fileName: string): Promise<string> {
    const s3 = this.getS3();
    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: config.aws.bucketName,
      Key: encodeURIComponent(`${uuid()}-${fileName}`),
      Expires: 60 * 60 * 1, // 1 hour
      ContentType: 'application/octet-stream',
    });
    return signedUrl;
  }

  private getS3() {
    return new S3({
      signatureVersion: 'v4',
      region: config.aws.region,
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    });
  }
}
