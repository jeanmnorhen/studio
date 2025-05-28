// src/app/admin/playground/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Supondo que você tenha este componente
import { FlaskConical, Info, ImageUp, AlertCircle, CheckCircle, ListTree } from 'lucide-react';
import { runObjectIdentificationAgentAction } from '@/app/actions';
import type { ObjectIdentificationAgentOutput } from '@/ai/flows/object-identification-flow';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/loader';

export default function PlaygroundPage() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ObjectIdentificationAgentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, GIF, WebP).');
        setImageDataUri(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Limpa o input
        }
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageDataUri(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageDataUri(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageDataUri) {
      setError("Por favor, selecione uma imagem para analisar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await runObjectIdentificationAgentAction({ imageDataUri });

    setIsLoading(false);
    if (result.success) {
      setAnalysisResult(result.data);
      toast({
        title: "Análise Concluída",
        description: "Os objetos foram identificados com sucesso.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
      setError(result.error);
      toast({
        title: "Erro na Análise",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setImageDataUri(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <FlaskConical className="mr-3 h-8 w-8" /> AI Playground
        </h1>
        <p className="text-muted-foreground">
          Teste o agente de identificação de objetos em imagens.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Testar Agente: Identificação de Objetos</CardTitle>
          <CardDescription>
            Faça upload de uma imagem para que o agente de IA identifique os objetos presentes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="image-upload" className="text-lg font-medium">Imagem</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20"
                />
              </div>
              {imagePreview && (
                <div className="mt-4 p-2 border border-dashed border-muted rounded-md max-w-sm mx-auto">
                  <p className="text-sm text-muted-foreground text-center mb-2">Pré-visualização:</p>
                  <img 
                    src={imagePreview} 
                    alt="Pré-visualização da imagem" 
                    className="max-w-full h-auto rounded-md shadow-md mx-auto"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClear} disabled={!imageDataUri && !isLoading}>
              Limpar
            </Button>
            <Button type="submit" disabled={!imageDataUri || isLoading} className="min-w-[120px]">
              {isLoading ? <Spinner className="mr-2" size={16} /> : <ImageUp className="mr-2 h-4 w-4" />}
              {isLoading ? "Analisando..." : "Analisar Imagem"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {analysisResult && analysisResult.objects.length > 0 && (
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListTree className="mr-2 h-5 w-5 text-primary" /> Resultados da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-foreground">
              {analysisResult.objects.map((obj, index) => (
                <li key={index} className="text-base">
                  {obj.name}
                  {/* obj.confidence && <span className="text-sm text-muted-foreground"> (Confiança: {(obj.confidence * 100).toFixed(1)}%)</span> */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {analysisResult && analysisResult.objects.length === 0 && !isLoading && (
         <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Nenhum Objeto Identificado</AlertTitle>
            <AlertDescription>
              O agente não conseguiu identificar objetos específicos na imagem fornecida ou a imagem não continha objetos claros.
            </AlertDescription>
          </Alert>
      )}

      <Alert className="mt-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Sobre o Playground</AlertTitle>
        <AlertDescription>
          Esta área permite testar agentes de IA. No futuro, você poderá selecionar diferentes agentes e ver seus formulários de entrada adaptados dinamicamente.
        </AlertDescription>
      </Alert>

    </div>
  );
}
