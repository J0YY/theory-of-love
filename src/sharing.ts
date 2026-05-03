import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { AppModel, defaultModel } from "./model";

const PARAM = "state";

export function loadSharedModel(): AppModel {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(PARAM);
  if (!encoded) return defaultModel;

  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return defaultModel;
    return normalizeModel(JSON.parse(json));
  } catch {
    return defaultModel;
  }
}

export function createShareUrl(model: AppModel): string {
  const encoded = compressToEncodedURIComponent(JSON.stringify(model));
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, encoded);
  return url.toString();
}

export function normalizeModel(value: unknown): AppModel {
  const incoming = value as Partial<AppModel>;
  return {
    ...defaultModel,
    ...incoming,
    version: 1,
    self: { ...defaultModel.self, ...incoming.self },
    partner: { ...defaultModel.partner, ...incoming.partner },
  };
}
