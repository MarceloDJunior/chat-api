import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { config } from '@/config/configutation';

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

  private getS3() {
    return new S3({
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    });
  }
}
