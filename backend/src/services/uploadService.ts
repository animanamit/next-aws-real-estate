import AWS from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// AWS S3 Configuration (will be set up later)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface UploadResult {
  url: string;
  key: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export class UploadService {
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'real-estate-uploads';
  }

  /**
   * Process and upload an image to S3
   */
  async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      folder?: string;
    } = {}
  ): Promise<UploadResult> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      folder = 'properties'
    } = options;

    try {
      // Process image with Sharp
      const processedImage = await sharp(buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality })
        .toBuffer();

      // Generate unique filename
      const fileExtension = this.getFileExtension(originalName);
      const uniqueKey = `${folder}/${uuidv4()}${fileExtension}`;

      // Upload to S3
      const uploadParams = {
        Bucket: this.bucketName,
        Key: uniqueKey,
        Body: processedImage,
        ContentType: 'image/jpeg',
        ACL: 'public-read', // Make images publicly accessible
      };

      const result = await s3.upload(uploadParams).promise();

      return {
        url: result.Location,
        key: uniqueKey,
        originalName,
        size: processedImage.length,
        mimeType: 'image/jpeg'
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: Array<{
      buffer: Buffer;
      originalName: string;
      mimeType: string;
    }>,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      folder?: string;
    } = {}
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(file =>
      this.uploadImage(file.buffer, file.originalName, file.mimeType, options)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from S3
   */
  async deleteImage(key: string): Promise<void> {
    try {
      await s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '.jpg';
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: {
    mimetype: string;
    size: number;
  }): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { valid: true };
  }
}

export const uploadService = new UploadService();