import { profileDisplayNames } from "../data/profiles";
import { PROFILE_IDS, type TestResult } from "./model";

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

  context.fillStyle = "#101011";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.strokeStyle = "#242126";
  context.lineWidth = 1;
  for (let y = 70; y < HEIGHT; y += 38) {
    context.beginPath();
    context.moveTo(72, y);
    context.lineTo(WIDTH - 72, y);
    context.stroke();
  }
  context.strokeStyle = "#d5586b";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(84, 0);
  context.lineTo(84, HEIGHT);
  context.stroke();

  context.strokeStyle = "#f3efe8";
  context.lineWidth = 4;
  context.setLineDash([86, 26]);
  context.beginPath();
  context.arc(154, 132, 36, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);
  context.strokeStyle = "#d5586b";
  context.beginPath();
  context.moveTo(164, 98);
  context.bezierCurveTo(150, 116, 145, 140, 140, 168);
  context.stroke();
  context.fillStyle = "#d5586b";
  context.beginPath();
  context.arc(164, 98, 6, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(140, 168, 6, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f3efe8";
  context.font = "600 34px 'Newsreader Variable', Georgia, serif";
  context.fillText("BDSMTest.top", 214, 144);
  context.fillStyle = "#ef8798";
  context.font = "600 20px 'DM Sans Variable', sans-serif";
  context.fillText("MY BDSM TEST RESULT", 106, 252);

  context.fillStyle = "#f3efe8";
  context.font = "600 78px 'Newsreader Variable', Georgia, serif";
  const profileLines = wrappedLines(context, result.primary, 840).slice(0, 3);
  profileLines.forEach((line, index) => context.fillText(line, 106, 350 + index * 76));
  let y = 418 + (profileLines.length - 1) * 76;
  context.fillStyle = "#aaa3a8";
  context.font = "500 24px 'DM Sans Variable', sans-serif";
  context.fillText("Your strongest match right now, followed by all ten role scores.", 106, y);

  y += 62;
  context.fillStyle = "#1b191d";
  context.fillRect(106, y, 868, 606);
  context.strokeStyle = "#3b363b";
  context.lineWidth = 2;
  roundRect(context, 106, y, 868, 606, 8);
  context.fillStyle = "#f3efe8";
  context.font = "600 25px 'DM Sans Variable', sans-serif";
  context.fillText("ROLE AFFINITIES", 144, y + 55);
  context.fillStyle = "#aaa3a8";
  context.font = "500 18px 'DM Sans Variable', sans-serif";
  context.textAlign = "right";
  context.fillText("0–100 · highest first", 936, y + 55);
  context.textAlign = "left";

  const rankedProfiles = [...PROFILE_IDS].sort((a, b) => result.profileScores[b] - result.profileScores[a]);
  rankedProfiles.forEach((profile, index) => {
    const column = index < 5 ? 0 : 1;
    const row = index % 5;
    const columnX = column === 0 ? 144 : 558;
    const rowY = y + 108 + row * 96;
    const score = Math.round(result.profileScores[profile]);
    context.fillStyle = "#f3efe8";
    context.font = "600 18px 'DM Sans Variable', sans-serif";
    context.fillText(profileDisplayNames[profile], columnX, rowY);
    context.fillStyle = "#ef8798";
    context.font = "600 22px 'Newsreader Variable', Georgia, serif";
    context.textAlign = "right";
    context.fillText(`${score}%`, columnX + 372, rowY);
    context.textAlign = "left";
    context.fillStyle = "#3b363b";
    context.fillRect(columnX, rowY + 20, 372, 9);
    context.fillStyle = "#d5586b";
    context.fillRect(columnX, rowY + 20, 372 * (score / 100), 9);
  });

  context.fillStyle = "#78b6ae";
  context.font = "600 20px 'DM Sans Variable', sans-serif";
  context.fillText("PRIVATE BY DESIGN", 106, 1242);
  context.fillStyle = "#aaa3a8";
  context.font = "500 20px 'DM Sans Variable', sans-serif";
  context.fillText("No answers or private limits are included.", 106, 1280);
  context.fillStyle = "#ef8798";
  context.font = "600 24px 'DM Sans Variable', sans-serif";
  context.textAlign = "right";
  context.fillText("TAKE THE BDSM TEST →", 974, 1242);
  context.fillStyle = "#f3efe8";
  context.font = "600 21px 'DM Sans Variable', sans-serif";
  context.fillText("bdsmtest.top", 974, 1280);

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
