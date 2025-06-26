import "./style.css";

interface BadgeOptions {
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
  x?: number;
  y?: number;
  font?: string;
}

let originalFaviconHref: string | null = null;

export function setBadge(count: number, options?: BadgeOptions) {
  if (originalFaviconHref === null) {
    const existingLink = document.querySelector(
      "link[rel*='icon']"
    ) as HTMLLinkElement | null;
    if (existingLink) {
      originalFaviconHref = existingLink.href;
    }
  }
  const defaultOptions: Required<BadgeOptions> = {
    backgroundColor: "#FF0000", // Red
    textColor: "#FFFFFF", // White
    radius: 8,
    x: 16,
    y: 16,
    font: "10px Arial",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const link: HTMLLinkElement | null =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");

  if (!link.rel) {
    link.rel = "icon";
    document.head.appendChild(link);
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("Canvas context not supported.");
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous"; // To avoid tainted canvas issues

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    context.drawImage(img, 0, 0, img.width, img.height);

    // Draw badge circle
    context.beginPath();
    context.arc(
      mergedOptions.x,
      mergedOptions.y,
      mergedOptions.radius,
      0,
      Math.PI * 2,
      false
    );
    context.fillStyle = mergedOptions.backgroundColor;
    context.fill();

    // Draw badge text
    context.font = mergedOptions.font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = mergedOptions.textColor;
    context.fillText(
      count.toString(),
      mergedOptions.x,
      mergedOptions.y + 1 // Adjust for better vertical alignment
    );

    link.href = canvas.toDataURL("image/png");
  };

  // Set the image source. If no favicon exists, use a transparent 16x16 image.
  img.src =
    link.href ||
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMElEQVR42mNkYGBgYGD4w/gPBAygoCAoFh+oWBj0gRgYGBgQBPg/GBiQGPg/AACuCgb/S/w/AAAAAElFTkSuQmCC";
}

export function clearBadge() {
  const link: HTMLLinkElement | null =
    document.querySelector("link[rel*='icon']");
  if (link && originalFaviconHref !== null) {
    link.href = originalFaviconHref;
    originalFaviconHref = null; // Reset for next use
  }
}
