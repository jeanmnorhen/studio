// src/components/image-analysis-form.tsx
"use client";

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { analyzeImageAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/loader';
import { UploadCloud, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ImageAnalysisForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [identifiedObjects, setIdentifiedObjects] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up the object URL when the component unmounts or image changes
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size, e.g., 4MB
        setError("File is too large. Please upload an image under 4MB.");
        toast({
          title: "Upload Error",
          description: "File is too large. Please upload an image under 4MB.",
          variant: "destructive",
        });
        clearStates();
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIdentifiedObjects(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreviewUrl) {
      setError('Please select an image first.');
      toast({
        title: "No Image",
        description: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdentifiedObjects(null);

    const result = await analyzeImageAction({ photoDataUri: imagePreviewUrl });

    if (result.success) {
      setIdentifiedObjects(result.data);
      if (result.data.length === 0) {
        toast({
          title: "Analysis Complete",
          description: "No objects were identified in the image.",
        });
      } else {
         toast({
          title: "Analysis Successful",
          description: "Objects identified in the image.",
        });
      }
    } else {
      setError(result.error);
      toast({
        title: "Analysis Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const clearStates = () => {
    setImageFile(null);
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setIdentifiedObjects(null);
    setIsLoading(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Upload Your Image</CardTitle>
        <CardDescription>Select an image file from your device to identify objects within it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/gif"
            ref={fileInputRef}
            aria-labelledby="file-upload-label"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            aria-label="Select image to upload"
            id="file-upload-label"
          >
            <UploadCloud className="mr-2 h-5 w-5" />
            {imageFile ? imageFile.name : 'Select Image'}
          </Button>
        </div>

        {imagePreviewUrl && (
          <div className="mt-4 border border-dashed border-border rounded-md p-4 flex justify-center items-center bg-muted/20 aspect-video">
            <Image 
              src={imagePreviewUrl} 
              alt="Uploaded preview" 
              width={500} 
              height={281} 
              className="max-w-full max-h-[40vh] h-auto rounded-md object-contain"
            />
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-primary p-4" aria-live="polite">
            <Spinner size={32} />
            <p className="mt-2 text-sm">Analyzing image, please wait...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" aria-live="assertive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {identifiedObjects && !isLoading && (
          <div className="space-y-3 pt-2" aria-live="polite">
            <h3 className="text-lg font-semibold text-primary">Identified Objects:</h3>
            {identifiedObjects.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 bg-muted/30 p-4 rounded-md border border-border">
                {identifiedObjects.map((obj, index) => (
                  <li key={index} className="text-foreground">{obj}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No objects were identified in the image.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !imagePreviewUrl}
          className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </Button>
        <Button
          onClick={clearStates}
          variant="outline"
          disabled={isLoading && (!imagePreviewUrl && !identifiedObjects && !error)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
