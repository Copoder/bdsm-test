import { dimensions } from "../data/questions";
import type { TestResult } from "./model";

const WIDTH = 1080;
const HEIGHT = 1350;

const roundRect = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.stroke();
};

const wrappedLines = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
};

export async function createResultImage(result: TestResult): Promise<Blob> {
  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");

  context.fillStyle = "#f8f5ee";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.strokeStyle = "#ded6ca";
  context.lineWidth = 1;
  for (let y = 70; y < HEIGHT; y += 38) {
    context.beginPath();
    context.moveTo(72, y);
    context.lineTo(WIDTH - 72, y);
    context.stroke();
  }
  context.strokeStyle = "#7c1f2a";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(84, 0);
  context.lineTo(84, HEIGHT);
  context.stroke();

  context.strokeStyle = "#171614";
  context.lineWidth = 5;
  context.beginPath();
  context.arc(154, 132, 36, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = "#7c1f2a";
  context.beginPath();
  context.moveTo(130, 172);
  context.lineTo(178, 92);
  context.stroke();
  context.fillStyle = "#7c1f2a";
  context.beginPath();
  context.arc(154, 132, 6, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#171614";
  context.font = "600 34px 'Newsreader Variable', Georgia, serif";
  context.fillText("BDSMTest.top", 214, 144);
  context.fillStyle = "#7c1f2a";
  context.font = "600 20px 'DM Sans Variable', sans-serif";
  context.fillText("MY CURRENT PREFERENCE MAP", 106, 252);

  context.fillStyle = "#171614";
  context.font = "600 86px 'Newsreader Variable', Georgia, serif";
  const profileLines = wrappedLines(context, result.primary, 840).slice(0, 3);
  profileLines.forEach((line, index) => context.fillText(line, 106, 358 + index * 84));
  let y = 430 + (profileLines.length - 1) * 84;
  context.fillStyle = "#45413d";
  context.font = "500 24px 'DM Sans Variable', sans-serif";
  context.fillText("Your answers suggest this pattern — not a fixed identity.", 106, y);

  y += 84;
  context.strokeStyle = "#aaa096";
  context.lineWidth = 2;
  roundRect(context, 106, y, 868, 470, 8);
  context.fillStyle = "#171614";
  context.font = "600 25px 'DM Sans Variable', sans-serif";
  context.fillText("TOP AFFINITIES", 144, y + 60);

  const topDimensions = [...dimensions].sort((a, b) => result.dimensions[b.id] - result.dimensions[a.id]).slice(0, 3);
  topDimensions.forEach((dimension, index) => {
    const rowY = y + 130 + index * 105;
    const score = result.dimensions[dimension.id];
    context.fillStyle = "#171614";
    context.font = "500 25px 'DM Sans Variable', sans-serif";
    context.fillText(dimension.shortName, 144, rowY);
    context.fillStyle = "#e3ddd3";
    context.fillRect(144, rowY + 24, 690, 14);
    context.fillStyle = dimension.color;
    context.fillRect(144, rowY + 24, 690 * (score / 100), 14);
    context.fillStyle = "#171614";
    context.font = "600 29px 'DM Sans Variable', sans-serif";
    context.textAlign = "right";
    context.fillText(String(score), 930, rowY + 10);
    context.textAlign = "left";
  });

  context.fillStyle = "#386b68";
  context.font = "600 20px 'DM Sans Variable', sans-serif";
  context.fillText("PRIVATE BY DESIGN", 106, 1190);
  context.fillStyle = "#45413d";
  context.font = "500 20px 'DM Sans Variable', sans-serif";
  context.fillText("Answers and private limits are not included.", 106, 1228);
  context.fillStyle = "#7c1f2a";
  context.font = "600 24px 'DM Sans Variable', sans-serif";
  context.textAlign = "right";
  context.fillText("TAKE THE BDSM TEST →", 974, 1190);
  context.fillStyle = "#171614";
  context.font = "600 21px 'DM Sans Variable', sans-serif";
  context.fillText("bdsmtest.top", 974, 1228);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not create result image")), "image/png");
  });
}

export function downloadBlob(blob: Blob, filename = "my-bdsm-test-result.png"): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
