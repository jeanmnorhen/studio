
// src/app/admin/playground/page.tsx
import ImageAnalysisForm from '@/components/image-analysis-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <FlaskConical className="mr-3 h-8 w-8" /> AI Playground
        </h1>
        <p className="text-muted-foreground">
          Test and experiment with the AI functionalities of your application.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Object Identification Test</CardTitle>
          <CardDescription>
            Use the form below to upload an image and test the object identification feature.
            The results will be displayed directly, and also saved to the Firebase Realtime Database
            if the "analyzeImageAction" is configured to do so.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto"> {/* Centering and max-width for the form */}
            <ImageAnalysisForm />
          </div>
        </CardContent>
      </Card>

      {/* You can add more test sections for other functionalities here in the future */}
      {/* 
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Another Functionality Test</CardTitle>
          <CardDescription>
            Description of another testable feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Placeholder for another test interface.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
