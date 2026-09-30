import type {
  ContentCatalogItem,
  ContentMediaMeta,
  ContentRendererId,
} from "@/data/service-catalog/types";
import {
  assertCatalogLiveGates as assertCatalogLiveGatesJs,
  contentMediaExists as contentMediaExistsJs,
  isCustomerLiveContent as isCustomerLiveContentJs,
  resolveContentRenderer as resolveContentRendererJs,
  validateContentLiveGate as validateContentLiveGateJs,
} from "./content-publication-gate.mjs";

export interface ContentLiveGateResult {
  ok: boolean;
  errors: string[];
}

export function contentMediaExists(media: ContentMediaMeta): boolean {
  return contentMediaExistsJs(media);
}

export function validateContentLiveGate(item: ContentCatalogItem): ContentLiveGateResult {
  return validateContentLiveGateJs(item);
}

export function isCustomerLiveContent(item: ContentCatalogItem): boolean {
  return isCustomerLiveContentJs(item);
}

export function assertCatalogLiveGates(items: ContentCatalogItem[]): ContentLiveGateResult {
  return assertCatalogLiveGatesJs(items);
}

export function resolveContentRenderer(item: ContentCatalogItem): ContentRendererId {
  return resolveContentRendererJs(item) as ContentRendererId;
}
