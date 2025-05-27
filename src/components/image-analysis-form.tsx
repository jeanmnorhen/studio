// src/components/image-analysis-form.tsx
"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { analyzeImageAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/loader';
import { UploadCloud, Trash2, AlertCircle, Sparkles } from 'lucide-react'; // Added Sparkles
import { useToast } from "@/hooks/use-toast";

export default function ImageAnalysisForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [identifiedObjects, setIdentifiedObjects] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size, e.g., 4MB
        setError("Arquivo muito grande. Envie uma imagem com menos de 4MB.");
        toast({
          title: "Erro no Upload",
          description: "Arquivo muito grande. Envie uma imagem com menos de 4MB.",
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
      setError('Por favor, selecione uma imagem primeiro.');
      toast({
        title: "Nenhuma Imagem",
        description: "Por favor, selecione uma imagem primeiro.",
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
          title: "Análise Completa",
          description: "Nenhum objeto foi identificado na imagem.",
        });
      } else {
         toast({
          title: "Análise Concluída",
          description: "Objetos identificados na imagem!",
        });
      }
    } else {
      setError(result.error);
      toast({
        title: "Falha na Análise",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const clearStates = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setIdentifiedObjects(null);
    setIsLoading(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full shadow-xl border-border rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl text-primary flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-accent" />
          Analisador de Imagens com IA
        </CardTitle>
        <CardDescription>
          Selecione uma imagem do seu dispositivo para identificar os objetos contidos nela.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
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
            className="w-full border-dashed border-2 border-primary/50 hover:border-primary text-primary hover:text-primary py-6 text-base"
            aria-label="Selecionar imagem para upload"
            id="file-upload-label"
          >
            <UploadCloud className="mr-2 h-5 w-5" />
            {imageFile ? imageFile.name : 'Clique para selecionar uma imagem'}
          </Button>
        </div>

        {imagePreviewUrl && (
          <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex justify-center items-center bg-muted/30 aspect-[16/10] overflow-hidden">
            <Image 
              src={imagePreviewUrl} 
              alt="Pré-visualização da imagem enviada" 
              width={600} 
              height={375} 
              className="max-w-full max-h-[45vh] h-auto rounded-md object-contain shadow-md"
            />
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-primary p-4" aria-live="polite">
            <Spinner size={36} />
            <p className="mt-3 text-sm font-medium">Analisando imagem, por favor aguarde...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" aria-live="assertive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na Análise</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {identifiedObjects && !isLoading && (
          <div className="space-y-3 pt-4" aria-live="polite">
            <h3 className="text-xl font-semibold text-primary">Objetos Identificados:</h3>
            {identifiedObjects.length > 0 ? (
              <ul className="list-none space-y-2 bg-muted/40 p-4 rounded-lg border border-border">
                {identifiedObjects.map((obj, index) => (
                  <li key={index} className="text-foreground text-base p-2 bg-background rounded-md shadow-sm border-l-4 border-accent">
                    {obj}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">Nenhum objeto específico foi identificado na imagem.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-6 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !imagePreviewUrl}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground focus-visible:ring-accent text-base py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? 'Analisando...' : 'Analisar Imagem'}
        </Button>
        <Button
          onClick={clearStates}
          variant="outline"
          disabled={isLoading || (!imageFile && !identifiedObjects && !error)}
          className="w-full sm:w-auto text-base py-3 px-6 rounded-lg"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </CardFooter>
    </Card>
  );
}
