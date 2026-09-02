"use client";

import { Button } from "@/components/ui/Button";
import { useLocalePath } from "@/hooks/useLocalePath";
import type { ComponentProps } from "react";

type LocalizedButtonProps = Omit<ComponentProps<typeof Button>, "href"> & {
  href: string;
};

export function LocalizedButton({ href, ...props }: LocalizedButtonProps) {
  const lp = useLocalePath();
  const resolved = href.startsWith("#") || href.startsWith("http") ? href : lp(href);
  return <Button href={resolved} {...props} />;
}
