import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  MockInstance,
} from "vitest";
import { setBadge, clearBadge } from "../src/index";

// Store original createElement outside beforeEach to avoid re-spying
const originalCreateElement = document.createElement;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MockContext {
  drawImage: MockInstance;
  beginPath: MockInstance;
  arc: MockInstance;
  fill: MockInstance;
  setFont: MockInstance;
  textAlign: string;
  textBaseline: string;
  fillStyle: string;
  fillText: MockInstance;
  clearRect: MockInstance;
  fillRect: MockInstance;
  stroke: MockInstance;
  closePath: MockInstance;
  measureText: MockInstance;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MockCanvas {
  getContext: MockInstance<[string], MockContext | null>;
  toDataURL: MockInstance<[], string>;
  width: number;
  height: number;
}

describe("Favicon Badge", () => {
  let link: HTMLLinkElement;
  let originalFaviconHref: string | null;
  let mockContext: MockContext;
  let createElementSpy: MockInstance;
  let appendChildSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset DOM before each test
    document.head.innerHTML = "";
    link = document.createElement("link");
    link.rel = "icon";
    link.href = "original-favicon.png";
    document.head.appendChild(link);
    originalFaviconHref = link.href;

    // Mock Image constructor
    vi.stubGlobal(
      "Image",
      class {
        onload: () => void = () => {};
        src: string = "";
        width: number = 16;
        height: number = 16;
        constructor() {
          Object.defineProperty(this, "src", {
            set: value => {
              this._src = value;
              // Call onload asynchronously to simulate image loading
              setTimeout(() => this.onload(), 0);
            },
            get: () => this._src,
          });
        }
      }
    );

    // Mock Canvas Context
    mockContext = {
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      setFont: vi.fn(),
      textAlign: "",
      textBaseline: "",
      fillStyle: "",
      fillText: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      stroke: vi.fn(),
      closePath: vi.fn(),
      measureText: vi.fn(() => ({ width: 10 })), // Mock measureText for text width calculations
    };

    // Spy on document.createElement and mock its implementation
    createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation(tagName => {
        if (tagName === "canvas") {
          return {
            getContext: vi.fn(() => mockContext), // Ensure getContext returns our mockContext
            toDataURL: vi.fn(() => "data:image/png;base64,mocked-image-data"),
            width: 0,
            height: 0,
          } as unknown as HTMLCanvasElement; // Type assertion
        } else {
          return originalCreateElement.call(document, tagName);
        }
      });

    // Spy on document.head.appendChild
    appendChildSpy = vi.spyOn(document.head, "appendChild");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should set a badge on the favicon", async () => {
    setBadge(5);
    await vi.runAllTimers();
    expect(link.href).toContain("data:image/png");
    expect(link.href).not.toBe(originalFaviconHref);
    expect(createElementSpy).toHaveBeenCalledWith("canvas");
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalledWith(
      5,
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should clear the badge and revert to the original favicon", async () => {
    setBadge(10);
    await vi.runAllTimers();
    expect(link.href).toContain("data:image/png");

    clearBadge();
    expect(link.href).toBe(originalFaviconHref);
  });

  it("should create a new link element if one does not exist", async () => {
    document.head.innerHTML = ""; // Clear head

    setBadge(1);
    await vi.runAllTimers();
    const newLink = document.querySelector("link[rel*='icon']");
    expect(newLink).not.toBeNull();
    expect(newLink?.getAttribute("rel")).toBe("icon");
    expect(newLink?.getAttribute("href")).toContain("data:image/png");
    expect(createElementSpy).toHaveBeenCalledWith("link"); // Explicitly check createElement for link
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLLinkElement)); // Explicitly check appendChild
  });

  it("should use default options when none are provided", async () => {
    setBadge(7);
    await vi.runAllTimers();
    expect(link.href).toContain("data:image/png");
    expect(createElementSpy).toHaveBeenCalledWith("canvas");
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalledWith(
      7,
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should use custom options when provided", async () => {
    setBadge(12, {
      backgroundColor: "blue",
      textColor: "yellow",
      radius: 10,
      x: 5,
      y: 5,
      font: "14px sans-serif",
    });
    await vi.runAllTimers();
    expect(link.href).toContain("data:image/png");
    expect(createElementSpy).toHaveBeenCalledWith("canvas");
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalledWith(12, 5, 6); // y + 1 for alignment
    expect(mockContext.fillStyle).toBe("yellow");
  });
});
