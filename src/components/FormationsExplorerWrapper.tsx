"use client";

import { useState, useEffect } from "react";
import { FormationsExplorer } from "./FormationsExplorer";

interface FormationsExplorerWrapperProps {
  formations: {
    id: number;
    slug: string;
    title: string;
    category: string;
    shortDescription: string;
    duration: string;
    level: string;
    price: number;
    registrationFee: number;
    campus: string;
    mode: string;
    isPopular: boolean | null;
    competencies: string;
    tools: string;
    imageUrl: string;
  }[];
}

export function FormationsExplorerWrapper({ formations }: FormationsExplorerWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return <FormationsExplorer formations={formations} isLoading={isLoading} />;
}