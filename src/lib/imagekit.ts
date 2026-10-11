/**
 * ImageKit helper for image upload & CDN asset management for ABCO Food Supply (AFS).
 * Configured via .env NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT and NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY.
 */

export const IMAGEKIT_CONFIG = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/wg5w5t4nz",
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "public_9iRLOLKY3mwrNinQksEhzmZWYIg=",
  authenticationEndpoint: "/api/imagekit/auth",
};

/**
 * Transforms an image path into a full ImageKit CDN URL
 */
export function getImageKitUrl(path: string, transformations?: { width?: number; height?: number; quality?: number }) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  let url = `${IMAGEKIT_CONFIG.urlEndpoint}/${cleanPath}`;

  if (transformations) {
    const tr = [];
    if (transformations.width) tr.push(`w-${transformations.width}`);
    if (transformations.height) tr.push(`h-${transformations.height}`);
    if (transformations.quality) tr.push(`q-${transformations.quality}`);
    if (tr.length > 0) {
      url += `?tr=${tr.join(",")}`;
    }
  }

  return url;
}
