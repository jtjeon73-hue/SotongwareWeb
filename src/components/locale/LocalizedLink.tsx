"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocalePath } from "@/hooks/useLocalePath";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const lp = useLocalePath();
  return <Link href={lp(href)} {...props} />;
}
