"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Loader2 } from 'lucide-react';

interface UploadedImage {
  url: string;
  key: string;
  originalName: string;
  size: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImages = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress('Preparing files...');

    try {
      const formData = new FormData();
      
      // Add all files to FormData
      Array.from(files).forEach((file, index) => {
        formData.append(`file`, file);
      });

      setUploadProgress('Uploading images...');

      const response = await fetch('http://localhost:3001/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Add new images to the existing array
        onImagesChange([...images, ...result.data]);
        setUploadProgress('Upload complete!');
        setTimeout(() => setUploadProgress(''), 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, onImagesChange, maxImages]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadImages(files);
    }
  }, [uploadImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      uploadImages(files);
    }
  }, [uploadImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback(async (index: number) => {
    const imageToRemove = images[index];
    
    try {
      // Delete from server (S3)
      const encodedKey = encodeURIComponent(imageToRemove.key);
      await fetch(`http://localhost:3001/api/upload/image/${encodedKey}`, {
        method: 'DELETE',
      });

      // Remove from local state
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Still remove from UI even if server deletion fails
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    }
  }, [images, onImagesChange]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-muted-red bg-coral-accent/10' 
            : 'border-warm-grey hover:border-muted-red'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 text-muted-red animate-spin" />
            <p className="text-charcoal-grey font-medium">{uploadProgress}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-warm-grey" />
            <div>
              <p className="text-charcoal-grey font-medium">
                Drop images here or click to browse
              </p>
              <p className="text-warm-grey text-sm mt-1">
                JPEG, PNG, WebP • Max 10MB per file • Up to {maxImages} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.key}
              className="relative group bg-white rounded-xl overflow-hidden border border-platinum-silver"
            >
              <img
                src={image.url}
                alt={image.originalName}
                className="w-full h-32 object-cover"
              />
              
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/50 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-muted-red text-white p-2 rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-soft-black/80 text-white p-2">
                <p className="text-xs truncate">{image.originalName}</p>
                <p className="text-xs text-platinum-silver">
                  {(image.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
          ))}

          {/* Add more button */}
          {images.length < maxImages && (
            <div
              onClick={triggerFileSelect}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-warm-grey rounded-xl cursor-pointer hover:border-muted-red hover:bg-coral-accent/5 transition-all duration-200"
            >
              <Plus className="h-6 w-6 text-warm-grey mb-2" />
              <span className="text-sm text-charcoal-grey">Add More</span>
            </div>
          )}
        </div>
      )}

      {/* Image count */}
      <div className="flex justify-between items-center text-sm text-warm-grey">
        <span>{images.length} of {maxImages} images uploaded</span>
        {images.length > 0 && (
          <span>Total size: {(images.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024)).toFixed(1)} MB</span>
        )}
      </div>
    </div>
  );
};