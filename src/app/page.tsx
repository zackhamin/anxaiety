"use client";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <div className="grid gap-4">
          <h3 className="font-medium leading-none">Login Required</h3>
          <p className="text-sm text-muted-foreground">
            Please log in to use the chat feature.
          </p>
        </div>
      </div>
    </main>
  );
}
