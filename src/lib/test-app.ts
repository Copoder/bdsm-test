import { boundaryCategories, boundaryOptions, type BoundaryMap, type BoundaryValue } from "../data/boundaries";
import { answerOptions, dimensions, questionOrder, QUESTION_VERSION } from "../data/questions";
import { profiles } from "../data/profiles";
import type { Answers, DimensionId, TestResult } from "./model";
import { scoreTest } from "./scoring";
import { createShareUrl, decodeShareEnvelope, type SharePayloadV1 } from "./share-codec";
import { createResultImage, downloadBlob } from "./share-image";
import {
  clearBoundaryMap,
  clearLocalTestData,
  isStorageAvailable,
  loadBoundaryMap,
  loadResult,
  loadSession,
  saveBoundaryMap,
  saveResult,
  saveSession
} from "./storage";

type View = "intro" | "gate" | "quiz" | "result" | "shared";

const required = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Test UI is missing ${selector}`);
  return element;
};

const setText = (root: ParentNode, selector: string, value: string): void => {
  required<HTMLElement>(root, selector).textContent = value;
};

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const resultSummaryText = (result: TestResult): string => {
  const top = [...dimensions]
    .sort((a, b) => result.dimensions[b.id] - result.dimensions[a.id])
    .slice(0, 3)
    .map((dimension) => `${dimension.shortName} ${result.dimensions[dimension.id]}`)
    .join(", ");
  return `I took the BDSM Test and got ${result.primary}. Top affinities: ${top}. This is a reflection result, not a diagnosis.`;
};

export function initTestApp(root: HTMLElement): void {
  let index = 0;
  let answers: Answers = {};
  let storageEnabled = isStorageAvailable();
  let currentResult: TestResult | null = storageEnabled ? loadResult() : null;
  let imagePromise: Promise<Blob> | null = null;
  let boundaries: BoundaryMap = storageEnabled ? loadBoundaryMap() : {};
  const session = storageEnabled ? loadSession() : null;
  const form = required<HTMLFormElement>(root, "[data-question-form]");
  const continueButton = required<HTMLButtonElement>(form, ".continue-button");
  const answerList = required<HTMLElement>(form, "[data-answer-list]");
  const backButton = required<HTMLButtonElement>(root, "[data-action='back']");
  const confirmationInputs = [...root.querySelectorAll<HTMLInputElement>("[data-confirm]")];
  const shareStatus = required<HTMLElement>(root, "[data-share-status]");

  const showManualCopy = (text: string): void => {
    const panel = required<HTMLElement>(root, "[data-copy-fallback]");
    const input = required<HTMLInputElement>(panel, "[data-manual-copy]");
    input.value = text;
    panel.hidden = false;
    input.focus();
    input.select();
  };

  if (!storageEnabled) required<HTMLElement>(root, "[data-storage-note]").hidden = false;
  if (session && Object.keys(session.answers).length > 0) required<HTMLElement>(root, "[data-resume]").hidden = false;
  if (currentResult) required<HTMLElement>(root, "[data-saved-result]").hidden = false;

  const showView = (view: View): void => {
    root.dataset.state = view;
    root.querySelectorAll<HTMLElement>("[data-view]").forEach((element) => {
      element.hidden = element.dataset.view !== view;
    });
    document.body.classList.toggle("test-active", view === "quiz");
    if (view !== "intro") root.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const persist = (): void => {
    if (!storageEnabled) return;
    storageEnabled = saveSession({ schemaVersion: 1, questionVersion: QUESTION_VERSION, index, answers });
    if (!storageEnabled) required<HTMLElement>(root, "[data-storage-note]").hidden = false;
  };

  const renderDimensionRows = (container: HTMLElement, scores: Record<DimensionId, number>): void => {
    container.replaceChildren(...dimensions.map((dimension) => {
      const row = document.createElement("div");
      row.className = "dimension-row";
      const label = document.createElement("span");
      label.textContent = dimension.shortName;
      const bar = document.createElement("span");
      bar.className = "dimension-bar";
      const fill = document.createElement("span");
      fill.style.setProperty("--score", `${scores[dimension.id]}%`);
      fill.style.setProperty("--bar-color", dimension.color);
      bar.append(fill);
      const score = document.createElement("strong");
      score.textContent = String(scores[dimension.id]);
      row.append(label, bar, score);
      return row;
    }));
  };

  const renderQuestion = (): void => {
    const question = questionOrder[index];
    const selected = answers[question.id];
    const dimension = dimensions.find((item) => item.id === question.dimension)!;
    setText(root, "[data-question-text]", question.text);
    setText(root, "[data-dimension-label]", dimension.shortName);
    setText(root, "[data-progress-label]", `${index + 1} of ${questionOrder.length}`);
    required<HTMLElement>(root, "[data-progress-bar]").style.width = `${((index + 1) / questionOrder.length) * 100}%`;
    backButton.disabled = index === 0;
    answerList.replaceChildren(
      ...answerOptions.map((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "answer-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "appeal";
        input.value = String(option.value);
        input.checked = selected === option.value;
        input.addEventListener("change", () => {
          answers[question.id] = option.value;
          continueButton.disabled = false;
          persist();
        });
        const number = document.createElement("span");
        number.className = "answer-number";
        number.textContent = String(optionIndex + 1);
        const copy = document.createElement("span");
        copy.className = "answer-copy";
        const strong = document.createElement("strong");
        strong.textContent = option.label;
        const small = document.createElement("small");
        small.textContent = option.note;
        copy.append(strong, small);
        label.append(input, number, copy);
        return label;
      })
    );
    continueButton.disabled = selected === undefined;
    continueButton.textContent = index === questionOrder.length - 1 ? "See my result" : "Continue";
  };

  const profileSummary = (result: TestResult): string => {
    if (result.isOpenEnded) return "Your answers do not strongly converge on one profile. Curiosity, context, or lower overall appeal may matter more than a single label right now.";
    if (result.isBlended) {
      return result.primary
        .split(" / ")
        .map((id) => profiles.find((profile) => profile.id === id)?.summary)
        .filter(Boolean)
        .join(" ");
    }
    return profiles.find((profile) => profile.id === result.primary)?.summary ?? "Your current preferences form a distinct pattern across the eight dimensions.";
  };

  const updateShareChannels = (result: TestResult): void => {
    const url = createShareUrl(result);
    const text = `I took the BDSM Test and got ${result.primary}. See my shared result, then discover yours.`;
    const urls: Record<string, string> = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent("My BDSM Test result")}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    root.querySelectorAll<HTMLAnchorElement>("[data-share-channel]").forEach((link) => {
      link.href = urls[link.dataset.shareChannel ?? ""] ?? url;
    });
  };

  const renderBoundaryMap = (): void => {
    const list = required<HTMLElement>(root, "[data-boundary-list]");
    list.replaceChildren(...boundaryCategories.map((category) => {
      const row = document.createElement("div");
      row.className = "boundary-row";
      const copy = document.createElement("div");
      copy.className = "boundary-copy";
      const title = document.createElement("strong");
      title.textContent = category.label;
      const note = document.createElement("small");
      note.textContent = category.note;
      copy.append(title, note);
      const options = document.createElement("div");
      options.className = "boundary-options";
      options.setAttribute("role", "radiogroup");
      options.setAttribute("aria-label", category.label);
      options.append(...boundaryOptions.map((option) => {
        const label = document.createElement("label");
        label.className = "boundary-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `boundary-${category.id}`;
        input.value = option.value;
        input.checked = boundaries[category.id] === option.value;
        input.addEventListener("change", () => {
          boundaries[category.id] = option.value as BoundaryValue;
          const saved = storageEnabled && saveBoundaryMap(boundaries);
          setText(root, "[data-boundary-status]", saved ? "Saved privately on this device." : "Kept only in this tab; browser storage is unavailable.");
        });
        label.append(input, document.createTextNode(option.label));
        return label;
      }));
      row.append(copy, options);
      return row;
    }));
  };

  const renderResult = (result: TestResult, persistResult = true): void => {
    currentResult = result;
    imagePromise = null;
    setText(root, "[data-result-primary]", result.primary);
    setText(root, "[data-result-summary]", profileSummary(result));
    const secondary = required<HTMLElement>(root, "[data-result-secondary]");
    secondary.hidden = !result.secondary;
    secondary.textContent = result.secondary ? `Secondary tendency: ${result.secondary}` : "";
    renderDimensionRows(required<HTMLElement>(root, "[data-dimension-results]"), result.dimensions);
    const renderTags = (selector: string, ids: DimensionId[]): void => {
      const container = required<HTMLElement>(root, selector);
      container.replaceChildren(...ids.map((id) => {
        const span = document.createElement("span");
        span.className = "result-tag";
        span.textContent = dimensions.find((item) => item.id === id)!.shortName;
        return span;
      }));
    };
    renderTags("[data-core-dimensions]", result.coreDimensions);
    renderTags("[data-context-dimensions]", result.contextDimensions);
    required<HTMLElement>(root, "[data-context-section]").hidden = result.contextDimensions.length === 0;
    const promptIds = [...result.coreDimensions, ...result.contextDimensions, ...dimensions.map((item) => item.id)];
    const uniquePromptIds = [...new Set(promptIds)].slice(0, 3);
    const prompts = required<HTMLOListElement>(root, "[data-communication-prompts]");
    prompts.replaceChildren(...uniquePromptIds.map((id) => {
      const item = document.createElement("li");
      item.textContent = dimensions.find((dimension) => dimension.id === id)!.communicationPrompt;
      return item;
    }));
    updateShareChannels(result);
    renderBoundaryMap();
    required<HTMLElement>(root, "[data-boundary-map]").hidden = true;
    required<HTMLElement>(root, "[data-qr-panel]").hidden = true;
    shareStatus.textContent = "";
    if (persistResult) saveResult(result);
    showView("result");
  };

  const renderSharedResult = (payload: SharePayloadV1): void => {
    setText(root, "[data-shared-primary]", payload.p);
    const scores = Object.fromEntries(dimensions.map((dimension, index) => [dimension.id, payload.a[index]])) as Record<DimensionId, number>;
    renderDimensionRows(required<HTMLElement>(root, "[data-shared-dimensions]"), scores);
    showView("shared");
  };

  const beginQuiz = (resume: boolean): void => {
    if (resume && session) {
      index = session.index;
      answers = session.answers;
    } else {
      index = 0;
      answers = {};
      currentResult = null;
      boundaries = {};
      clearLocalTestData();
    }
    renderQuestion();
    showView("quiz");
  };

  const getImage = (): Promise<Blob> => {
    if (!currentResult) throw new Error("No result is available");
    imagePromise ??= createResultImage(currentResult);
    return imagePromise;
  };

  const shareLink = async (): Promise<void> => {
    if (!currentResult) return;
    const url = createShareUrl(currentResult);
    const text = `I took the BDSM Test and got ${currentResult.primary}. See my shared result, then discover yours.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My BDSM Test result", text, url });
        shareStatus.textContent = "Shared.";
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") shareStatus.textContent = "Sharing was unavailable. Use Copy link instead.";
      }
      return;
    }
    const copied = await copyText(url);
    if (!copied) showManualCopy(url);
    shareStatus.textContent = copied ? "Result link copied." : "Clipboard access is blocked. The link is selected for manual copying.";
  };

  const shareImage = async (): Promise<void> => {
    if (!currentResult) return;
    shareStatus.textContent = "Creating your private share image…";
    const blob = await getImage();
    const file = new File([blob], "my-bdsm-test-result.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: "My BDSM Test result", text: "My current BDSM preference map.", files: [file] });
        shareStatus.textContent = "Image shared.";
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          downloadBlob(blob);
          shareStatus.textContent = "Image sharing was unavailable, so the image was downloaded.";
        }
      }
      return;
    }
    downloadBlob(blob);
    shareStatus.textContent = "Image downloaded.";
  };

  root.addEventListener("click", async (event) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-action]");
    if (!target) return;
    try {
      switch (target.dataset.action) {
        case "start": showView("gate"); break;
        case "shared-start": showView("gate"); break;
        case "gate-back": showView("intro"); break;
        case "confirm": beginQuiz(false); break;
        case "resume": beginQuiz(true); break;
        case "restart": showView("gate"); break;
        case "saved-result": if (currentResult) renderResult(currentResult, false); break;
        case "back":
          if (index > 0) {
            index -= 1;
            persist();
            renderQuestion();
          }
          break;
        case "retake":
          clearLocalTestData();
          currentResult = null;
          boundaries = {};
          answers = {};
          index = 0;
          confirmationInputs.forEach((input) => { input.checked = false; });
          required<HTMLButtonElement>(root, "[data-action='confirm']").disabled = true;
          showView("gate");
          break;
        case "boundary":
          required<HTMLElement>(root, "[data-boundary-map]").hidden = false;
          required<HTMLElement>(root, "[data-boundary-map]").scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        case "close-boundary": required<HTMLElement>(root, "[data-boundary-map]").hidden = true; break;
        case "clear-boundaries":
          boundaries = {};
          clearBoundaryMap();
          renderBoundaryMap();
          setText(root, "[data-boundary-status]", "Private map cleared.");
          break;
        case "share-link": await shareLink(); break;
        case "share-image": await shareImage(); break;
        case "copy-link":
          if (currentResult) {
            const text = createShareUrl(currentResult);
            const copied = await copyText(text);
            if (!copied) showManualCopy(text);
            shareStatus.textContent = copied ? "Result link copied." : "The link is selected for manual copying.";
          }
          break;
        case "copy-text":
          if (currentResult) {
            const text = `${resultSummaryText(currentResult)} ${createShareUrl(currentResult)}`;
            const copied = await copyText(text);
            if (!copied) showManualCopy(text);
            shareStatus.textContent = copied ? "Result text copied." : "The result text is selected for manual copying.";
          }
          break;
        case "hide-copy": required<HTMLElement>(root, "[data-copy-fallback]").hidden = true; break;
        case "download-image":
          downloadBlob(await getImage());
          shareStatus.textContent = "Image downloaded.";
          break;
        case "show-qr":
          if (currentResult) {
            const QRCode = await import("qrcode");
            await QRCode.toCanvas(required<HTMLCanvasElement>(root, "[data-qr-canvas]"), createShareUrl(currentResult), {
              width: 260,
              margin: 2,
              color: { dark: "#171614", light: "#fffdf8" },
              errorCorrectionLevel: "M"
            });
            required<HTMLElement>(root, "[data-qr-panel]").hidden = false;
          }
          break;
        case "hide-qr": required<HTMLElement>(root, "[data-qr-panel]").hidden = true; break;
      }
    } catch {
      shareStatus.textContent = "That action is unavailable in this browser. Your result is still safe.";
    }
  });

  confirmationInputs.forEach((input) => input.addEventListener("change", () => {
    required<HTMLButtonElement>(root, "[data-action='confirm']").disabled = !confirmationInputs.every((item) => item.checked);
  }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = questionOrder[index];
    if (answers[question.id] === undefined) return;
    if (index === questionOrder.length - 1) {
      renderResult(scoreTest(answers));
      return;
    }
    index += 1;
    persist();
    renderQuestion();
    form.scrollIntoView({ behavior: "auto", block: "start" });
  });

  root.addEventListener("keydown", (event) => {
    if (root.dataset.state !== "quiz") return;
    const number = Number(event.key);
    if (number >= 1 && number <= 5) {
      const input = answerList.querySelectorAll<HTMLInputElement>("input")[number - 1];
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      event.preventDefault();
    }
  });

  const sharedEnvelope = location.hash.startsWith("#r=") ? location.hash.slice(3) : null;
  if (sharedEnvelope !== null) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    try {
      renderSharedResult(decodeShareEnvelope(sharedEnvelope));
    } catch {
      required<HTMLElement>(root, "[data-shared-error]").hidden = false;
      showView("intro");
    }
  }
}
