import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('DO_SPACES_REGION')!,
      endpoint: this.configService.get<string>('DO_SPACES_ENDPOINT')!,
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACES_KEY')!,
        secretAccessKey: this.configService.get<string>('DO_SPACES_SECRET')!,
      },
    });
  }
  async uploadFile(file: Express.Multer.File) : Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const bucketName = this.configService.get<string>('DO_SPACES_BUCKET')!;

    await this.s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
    })
    
    );
    const cdnUrl = this.configService.get('CDN_URL') || this.configService.get('DO_SPACES_ENDPOINT');
    return `${cdnUrl}/${fileName}`;
  }
}
