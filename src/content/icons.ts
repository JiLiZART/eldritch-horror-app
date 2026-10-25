import type { IconManifest } from "./types";

/** Path under public/ for a named icon; throws on an unknown name instead of returning a placeholder. */
export function iconPath(manifest: IconManifest, name: string): string {
  const entry = manifest.icons[name];
  if (entry === undefined) throw new Error(`unknown icon ${name}`);
  return entry.file;
}
