import ImageAnalysisForm from '@/components/image-analysis-form';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary">Visionary Lens</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload an image and let AI identify the objects within.
          </p>
        </header>
        <ImageAnalysisForm />
      </div>
    </main>
  );
}
