import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
}

export function ImageUpload({ imageFile, onImageChange }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onImageChange(file ?? null);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-3">
      {!imageFile ? (
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground mb-2">
            Clique para selecionar uma imagem
          </p>
          <p className="text-muted-foreground text-sm">PNG, JPG até 5MB</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Selecionar Imagem
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-border rounded-xl p-4 bg-muted">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview da imagem"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      📷
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{imageFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
