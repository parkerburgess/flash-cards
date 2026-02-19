import { ReactNode } from "react";

interface PageWrapperProps {
  title: string;
  children: ReactNode;
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      {children}
    </main>
  );
}
