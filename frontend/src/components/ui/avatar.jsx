// src/components/ui/avatar.jsx
import * as React from "react";

export function Avatar({ children, className }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="object-cover w-full h-full" />;
}

export function AvatarFallback({ children }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm font-medium">
      {children}
    </div>
  );
}
