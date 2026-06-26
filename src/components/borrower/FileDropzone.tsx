"use client";

import { ChangeEvent, useState } from "react";
import clsx from "clsx";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface FileDropzoneProps {
  onFileSelected: (file: File | null) => void;
  error?: string;
}

export function FileDropzone({ onFileSelected, error }: FileDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setFileName(null);
      onFileSelected(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Only PDF, JPG and PNG files are allowed");
      onFileSelected(null);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError("File must be 5MB or smaller");
      onFileSelected(null);
      return;
    }
    setLocalError(null);
    setFileName(file.name);
    onFileSelected(file);
  };

  const displayError = error ?? localError;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="salarySlip"
        className={clsx(
          "flex h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-center transition-colors",
          displayError ? "border-danger-600 bg-danger-100" : "border-border bg-paper-muted hover:border-navy-500"
        )}
      >
        <span className="font-body text-body text-ink-950">
          {fileName ?? "Click to upload your salary slip"}
        </span>
        <span className="text-caption text-slate-500">PDF, JPG or PNG &middot; max 5MB</span>
        <input
          id="salarySlip"
          name="salarySlip"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleChange}
        />
      </label>
      {displayError && <p className="text-caption text-danger-600">{displayError}</p>}
    </div>
  );
}
