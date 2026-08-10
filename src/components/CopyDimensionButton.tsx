"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyAreaToClipboard, copyVolumeToClipboard } from "@/lib/copyDimensions";

type CopyDimensionType = "volume" | "area";

interface CopyDimensionButtonProps {
  type: CopyDimensionType;
}

export function CopyDimensionButton({ type }: CopyDimensionButtonProps) {
  const [copied, setCopied] = useState(false);
  const label = type === "volume" ? "Hacim Kopyala" : "Alan Kopyala";

  const handleCopy = async () => {
    const ok =
      type === "volume"
        ? await copyVolumeToClipboard()
        : await copyAreaToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full mt-1.5"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-emerald-600" />
          Kopyalandı
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}
