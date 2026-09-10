// Vinext replaces this value in both the server and browser bundles.
export function publicAsset(path: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_BASE ?? ''}${path}`;
}
