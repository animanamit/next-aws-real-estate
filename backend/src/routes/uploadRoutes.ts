import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { uploadService, UploadService } from '../services/uploadService';

export async function uploadRoutes(fastify: FastifyInstance) {
  // Register multipart plugin for file uploads
  await fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  });

  // Upload single image
  fastify.post('/upload/image', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      // Validate file
      const validation = UploadService.validateImageFile({
        mimetype: data.mimetype,
        size: data.file.bytesRead || 0
      });

      if (!validation.valid) {
        return reply.status(400).send({ error: validation.error });
      }

      // Convert stream to buffer
      const buffer = await data.toBuffer();

      // Upload to S3
      const result = await uploadService.uploadImage(
        buffer,
        data.filename,
        data.mimetype,
        {
          folder: 'properties',
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 85
        }
      );

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Upload error:', error);
      reply.status(500).send({
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Upload multiple images
  fastify.post('/upload/images', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parts = request.files();
      const files: Array<{
        buffer: Buffer;
        originalName: string;
        mimeType: string;
      }> = [];

      for await (const part of parts) {
        // Validate each file
        const validation = UploadService.validateImageFile({
          mimetype: part.mimetype,
          size: part.file.bytesRead || 0
        });

        if (!validation.valid) {
          return reply.status(400).send({ error: validation.error });
        }

        const buffer = await part.toBuffer();
        files.push({
          buffer,
          originalName: part.filename,
          mimeType: part.mimetype
        });
      }

      if (files.length === 0) {
        return reply.status(400).send({ error: 'No files uploaded' });
      }

      // Upload all images
      const results = await uploadService.uploadMultipleImages(files, {
        folder: 'properties',
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85
      });

      reply.send({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Upload error:', error);
      reply.status(500).send({
        error: 'Failed to upload images',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete image
  fastify.delete('/upload/image/:key', async (request: FastifyRequest<{
    Params: { key: string }
  }>, reply: FastifyReply) => {
    try {
      const { key } = request.params;
      
      // Decode the key (it might be URL encoded)
      const decodedKey = decodeURIComponent(key);
      
      await uploadService.deleteImage(decodedKey);
      
      reply.send({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      reply.status(500).send({
        error: 'Failed to delete image',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get upload configuration (for frontend)
  fastify.get('/upload/config', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFiles: 10, // Maximum number of images per property
    });
  });
}