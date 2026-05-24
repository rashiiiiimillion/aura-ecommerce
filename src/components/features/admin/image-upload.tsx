"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { X, UploadCloud, GripVertical, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export function ImageUpload({ value = [], onChange, disabled, onUploadStart, onUploadEnd }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!supabase) {
        toast.error("Supabase client not initialized.");
        return;
      }

      setIsUploading(true);
      onUploadStart?.();
      const newUrls: string[] = [];

      for (const file of acceptedFiles) {
        try {
          console.log(`[ImageUpload] Starting upload for ${file.name}`);
          const safeName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, "-")
            .replace(/-+/g, "-");
          
          const randomSuffix = Math.random().toString(36).substring(2, 7);
          const filePath = `products/${Date.now()}-${randomSuffix}-${safeName}`;

          console.log(`[ImageUpload] Generated path: ${filePath}`);
          console.log(`[ImageUpload] Target bucket: product-images`);

          const uploadResponse = await supabase.storage
            .from("product-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          console.log(`[ImageUpload] Upload response:`, uploadResponse);

          const { error: uploadError } = uploadResponse;

          if (uploadError) {
            console.error(`[ImageUpload] Upload failed for ${file.name}:`, uploadError);
            throw uploadError;
          }

          const urlResponse = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);
          
          console.log(`[ImageUpload] Public URL response:`, urlResponse);
          const { data: { publicUrl } } = urlResponse;

          console.log(`[ImageUpload] Upload successful for ${file.name}, URL: ${publicUrl}`);
          newUrls.push(publicUrl);
        } catch (error: any) {
          toast.error(`Failed to upload ${file.name}: ${error.message || "Unknown error"}`);
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast.success(`Successfully uploaded ${newUrls.length} image(s).`);
      }
      setIsUploading(false);
      onUploadEnd?.();
    },
    [onChange, value, onUploadStart, onUploadEnd]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    disabled: disabled || isUploading,
  });

  const handleRemove = (indexToRemove: number) => {
    const newImages = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      const newImages = [...value];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      onChange(newImages);
    } else if (direction === 'right' && index < value.length - 1) {
      const newImages = [...value];
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
      onChange(newImages);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-border/50 bg-black/5 dark:bg-white/5 p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? "border-foreground bg-black/10 dark:bg-white/10" : ""
        } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-foreground/50 hover:bg-black/10 dark:hover:bg-white/10"}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Uploading to Secure Storage...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="text-xs uppercase tracking-widest font-medium">Drag & drop images here</span>
            <span className="text-[10px] uppercase tracking-wider">or click to browse</span>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {value.map((url, index) => (
            <div key={url} className="relative group aspect-[3/4] bg-black/5 dark:bg-white/5 border border-border/50 overflow-hidden">
              <Image 
                src={url} 
                alt={`Product image ${index + 1}`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                    className="p-1 bg-white/10 hover:bg-red-500/80 text-white rounded-none backdrop-blur-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-center gap-2 pb-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveImage(index, 'left'); }}
                    disabled={index === 0}
                    className="p-1 bg-white/20 hover:bg-white/40 text-white rounded-none backdrop-blur-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="text-[10px] uppercase tracking-wider px-2">&larr; Move</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveImage(index, 'right'); }}
                    disabled={index === value.length - 1}
                    className="p-1 bg-white/20 hover:bg-white/40 text-white rounded-none backdrop-blur-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="text-[10px] uppercase tracking-wider px-2">Move &rarr;</span>
                  </button>
                </div>
              </div>
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
