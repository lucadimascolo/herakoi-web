/**
 * We keep image loading and pixel sampling in one place so the controller only asks
 * for "give me hue/value at this point" and never touches raw ImageData. This mirrors
 * the modernization plan for step 3: store the uploaded image once, expose simple
 * sampling helpers, and hide the encoding details that turn RGB into sonification-friendly bytes.
 */

export type PixelSample = { hueByte: number; valueByte: number; alpha: number };

type CanvasLike = HTMLCanvasElement | OffscreenCanvas;

const defaultCanvasFactory = (): CanvasLike | null => {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(1, 1);
  }

  if (typeof document !== "undefined") {
    return document.createElement("canvas");
  }

  return null;
};

const encodeHueValue = (imageData: ImageData) => {
  const encoded = new Uint8ClampedArray(imageData.data.length);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] / 255;
    const g = imageData.data[i + 1] / 255;
    const b = imageData.data[i + 2] / 255;

    const cmax = Math.max(r, g, b);
    const cmin = Math.min(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    if (delta !== 0) {
      if (cmax === r) {
        h = 60 * (((g - b) / delta) % 6);
      } else if (cmax === g) {
        h = 60 * ((b - r) / delta + 2);
      } else {
        h = 60 * ((r - g) / delta + 4);
      }
    }

    if (h < 0) h += 360;

    const v = cmax;
    const hByte = Math.round((h / 360) * 255);
    const vByte = Math.round(v * 255);

    encoded[i] = hByte;
    encoded[i + 1] = hByte;
    encoded[i + 2] = vByte;
    encoded[i + 3] = imageData.data[i + 3];
  }

  return encoded;
};

const loadImageFromFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };

    img.src = objectUrl;
  });

export class ImageSampler {
  private encoded: Uint8ClampedArray | null = null;
  private width = 0;
  private height = 0;

  private constructor() {}

  /**
   * Browser helper: read the uploaded file, scale it to the target size, and encode it for sampling.
   * Drawing the image is intentionally left to the caller so we keep rendering concerns separate
   * from hue/value extraction.
   */
  static async fromFile(
    file: File,
    targetSize: { width: number; height: number },
    canvasFactory: () => CanvasLike | null = defaultCanvasFactory,
    imageLoader: (file: File) => Promise<HTMLImageElement> = loadImageFromFile,
  ): Promise<ImageSampler> {
    const sampler = new ImageSampler();
    await sampler.initialize(file, targetSize, canvasFactory, imageLoader);
    return sampler;
  }

  /**
   * Pure helper: accept an ImageData (useful for tests or callers that already drew to a canvas)
   * and keep the encoded bytes in memory.
   */
  static fromImageData(imageData: ImageData): ImageSampler {
    const sampler = new ImageSampler();
    sampler.ingestImageData(imageData);
    return sampler;
  }

  public hasImage(): boolean {
    return this.encoded !== null;
  }

  public getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  public sampleAtPixel(x: number, y: number): PixelSample | null {
    if (!this.encoded) {
      return null;
    }

    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }

    const i = (y * this.width + x) * 4;

    return {
      hueByte: this.encoded[i],
      valueByte: this.encoded[i + 2],
      alpha: this.encoded[i + 3],
    };
  }

  private async initialize(
    file: File,
    targetSize: { width: number; height: number },
    canvasFactory: () => CanvasLike | null,
    imageLoader: (file: File) => Promise<HTMLImageElement>,
  ): Promise<void> {
    const canvas = canvasFactory();
    if (!canvas) {
      throw new Error("ImageSampler could not acquire a canvas for decoding the file.");
    }

    canvas.width = targetSize.width;
    canvas.height = targetSize.height;

    const img = await imageLoader(file);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("ImageSampler could not acquire a 2D context for decoding.");
    }

    ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);
    const imageData = ctx.getImageData(0, 0, targetSize.width, targetSize.height);

    this.ingestImageData(imageData);
  }

  private ingestImageData(imageData: ImageData): void {
    this.width = imageData.width;
    this.height = imageData.height;
    this.encoded = encodeHueValue(imageData);
  }
}
