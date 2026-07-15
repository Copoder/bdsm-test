import { boundaryCategories, boundaryOptions, type BoundaryMap, type BoundaryValue } from "../data/boundaries";
import { answerOptions, dimensions, questionOrder, QUESTION_VERSION } from "../data/questions";
import { profileDisplayNames, profiles } from "../data/profiles";
import { PROFILE_IDS, type Answers, type DimensionId, type ProfileId, type TestResult } from "./model";
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
  const top = [...PROFILE_IDS]
    .sort((a, b) => result.profileScores[b] - result.profileScores[a])
    .slice(0, 3)
    .map((profile) => `${profileDisplayNames[profile]} ${Math.round(result.profileScores[profile])}%`)
    .join(", ");
  return `My BDSM Test profile is ${result.primary}. Top role scores: ${top}.`;
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
  const answerList = required<HTMLElement>(form, "[data-answer-list]");
  const backButton = required<HTMLButtonElement>(root, "[data-action='back']");
  const nextButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-action='next']")];
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

  const showResumeState = (savedIndex: number): void => {
    root.dataset.hasResume = "true";
    required<HTMLElement>(root, "[data-resume]").hidden = false;
    required<HTMLElement>(root, "[data-saved-result]").hidden = true;
    setText(root, "[data-resume-label]", storageEnabled
      ? `Continue at ${String(savedIndex + 1).padStart(2, "0")} / ${questionOrder.length}. Saved on this device.`
      : `Continue at ${String(savedIndex + 1).padStart(2, "0")} / ${questionOrder.length}. Kept in this tab.`);
  };

  if (session && Object.keys(session.answers).length > 0) {
    showResumeState(session.index);
  } else if (currentResult) {
    root.dataset.hasResult = "true";
    required<HTMLElement>(root, "[data-saved-result]").hidden = false;
  }

  const showView = (view: View): void => {
    root.dataset.state = view;
    root.querySelectorAll<HTMLElement>("[data-view]").forEach((element) => {
      element.hidden = element.dataset.view !== view;
    });
    document.body.classList.toggle("test-active", view !== "intro");
    if (view !== "intro") root.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const persist = (): void => {
    if (!storageEnabled) return;
    storageEnabled = saveSession({ schemaVersion: 1, questionVersion: QUESTION_VERSION, index, answers });
    if (!storageEnabled) required<HTMLElement>(root, "[data-storage-note]").hidden = false;
  };

  const renderDimensionRows = (container: HTMLElement, scores: Record<DimensionId, number>): void => {
    const rankedDimensions = [...dimensions].sort((a, b) => scores[b.id] - scores[a.id]);
    container.replaceChildren(...rankedDimensions.map((dimension) => {
      const row = document.createElement("details");
      row.className = "dimension-row";
      const summary = document.createElement("summary");
      const summaryCopy = document.createElement("span");
      summaryCopy.className = "dimension-summary-copy";
      const label = document.createElement("span");
      label.textContent = dimension.shortName;
      const score = document.createElement("strong");
      score.textContent = `${scores[dimension.id]}%`;
      summaryCopy.append(label, score);
      const bar = document.createElement("span");
      bar.className = "dimension-bar";
      const fill = document.createElement("span");
      fill.style.setProperty("--score", `${scores[dimension.id]}%`);
      fill.style.setProperty("--bar-color", dimension.color);
      bar.append(fill);
      const chevron = document.createElement("span");
      chevron.className = "dimension-chevron";
      chevron.setAttribute("aria-hidden", "true");
      summary.append(summaryCopy, bar, chevron);
      const detail = document.createElement("div");
      detail.className = "dimension-detail";
      const description = document.createElement("p");
      description.textContent = dimension.description;
      const disclaimer = document.createElement("small");
      disclaimer.textContent = dimension.disclaimer;
      detail.append(description, disclaimer);
      row.append(summary, detail);
      return row;
    }));
  };

  const renderRoleRows = (container: HTMLElement, scores: Record<ProfileId, number>): void => {
    const rankedProfiles = [...PROFILE_IDS].sort((a, b) => scores[b] - scores[a]);
    container.replaceChildren(...rankedProfiles.map((profileId, rank) => {
      const profile = profiles.find((item) => item.id === profileId)!;
      const score = Math.round(scores[profileId]);
      const row = document.createElement("details");
      row.className = "role-score-row";
      const summary = document.createElement("summary");
      const rankLabel = document.createElement("span");
      rankLabel.className = "role-rank";
      rankLabel.textContent = String(rank + 1).padStart(2, "0");
      const name = document.createElement("strong");
      name.textContent = profileDisplayNames[profileId];
      const value = document.createElement("span");
      value.className = "role-score-value";
      value.textContent = `${score}%`;
      const toggle = document.createElement("span");
      toggle.className = "role-score-toggle";
      toggle.setAttribute("aria-hidden", "true");
      toggle.textContent = "+";
      const bar = document.createElement("span");
      bar.className = "role-score-bar";
      const fill = document.createElement("span");
      fill.style.setProperty("--role-score", `${score}%`);
      bar.append(fill);
      summary.append(rankLabel, name, value, toggle, bar);
      const detail = document.createElement("div");
      detail.className = "role-score-detail";
      const summaryText = document.createElement("p");
      summaryText.textContent = profile.summary;
      const reflection = document.createElement("small");
      reflection.textContent = profile.reflection;
      detail.append(summaryText, reflection);
      row.append(summary, detail);
      return row;
    }));
  };

  const renderRadar = (container: HTMLElement, scores: Record<DimensionId, number>): void => {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const size = 360;
    const center = size / 2;
    const radius = 108;
    const labelRadius = 126;
    const pointAt = (position: number, distance: number): [number, number] => {
      const angle = (Math.PI * 2 * position) / dimensions.length - Math.PI / 2;
      return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance];
    };
    const pointsAt = (distance: number): string => dimensions
      .map((_, position) => pointAt(position, distance).join(","))
      .join(" ");
    const makeSvg = <K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] =>
      document.createElementNS(svgNamespace, tag);

    const svg = makeSvg("svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", dimensions.map((dimension) => `${dimension.shortName} ${scores[dimension.id]} percent`).join(", "));

    const grid = makeSvg("g");
    grid.setAttribute("class", "radar-grid");
    [0.25, 0.5, 0.75, 1].forEach((level) => {
      const polygon = makeSvg("polygon");
      polygon.setAttribute("points", pointsAt(radius * level));
      grid.append(polygon);
    });
    dimensions.forEach((_, position) => {
      const [x, y] = pointAt(position, radius);
      const axis = makeSvg("line");
      axis.setAttribute("x1", String(center));
      axis.setAttribute("y1", String(center));
      axis.setAttribute("x2", String(x));
      axis.setAttribute("y2", String(y));
      grid.append(axis);
    });

    const shape = makeSvg("polygon");
    shape.setAttribute("class", "radar-shape");
    shape.setAttribute("points", dimensions.map((dimension, position) =>
      pointAt(position, radius * scores[dimension.id] / 100).join(",")
    ).join(" "));

    const points = makeSvg("g");
    points.setAttribute("class", "radar-points");
    dimensions.forEach((dimension, position) => {
      const [x, y] = pointAt(position, radius * scores[dimension.id] / 100);
      const point = makeSvg("circle");
      point.setAttribute("cx", String(x));
      point.setAttribute("cy", String(y));
      point.setAttribute("r", "4");
      points.append(point);
    });

    const labels = makeSvg("g");
    labels.setAttribute("class", "radar-labels");
    const labelLines: Record<DimensionId, string[]> = {
      DIR: ["Direction"],
      SUR: ["Surrender"],
      IGV: ["Giving", "intensity"],
      IRC: ["Receiving", "intensity"],
      RST: ["Restraint", "& craft"],
      CAR: ["Service", "& care"],
      PLY: ["Play", "& challenge"],
      EXP: ["Exploration", "& ritual"]
    };
    dimensions.forEach((dimension, position) => {
      const [rawX, y] = pointAt(position, labelRadius);
      const x = position === 6 ? rawX + 10 : rawX;
      const label = makeSvg("text");
      label.setAttribute("x", String(x));
      label.setAttribute("y", String(y - ((labelLines[dimension.id].length - 1) * 6)));
      label.setAttribute("text-anchor", Math.abs(x - center) < 10 ? "middle" : x < center ? "end" : "start");
      labelLines[dimension.id].forEach((line, lineIndex) => {
        const span = makeSvg("tspan");
        span.setAttribute("x", String(x));
        span.setAttribute("dy", lineIndex === 0 ? "0" : "12");
        span.textContent = line;
        label.append(span);
      });
      labels.append(label);
    });

    svg.append(grid, shape, points, labels);
    container.replaceChildren(svg);
  };

  const goNext = (expectedQuestionId?: number): void => {
    const question = questionOrder[index];
    if (!question || (expectedQuestionId !== undefined && question.id !== expectedQuestionId) || answers[question.id] === undefined) return;
    if (index === questionOrder.length - 1) {
      renderResult(scoreTest(answers));
      return;
    }
    index += 1;
    persist();
    renderQuestion();
    form.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const renderQuestion = (): void => {
    const question = questionOrder[index];
    const selected = answers[question.id];
    setText(root, "[data-question-text]", question.text);
    setText(root, "[data-dimension-label]", "Current appeal");
    setText(root, "[data-progress-label]", `${String(index + 1).padStart(2, "0")} / ${questionOrder.length}`);
    required<HTMLElement>(root, "[data-progress-bar]").style.width = `${((index + 1) / questionOrder.length) * 100}%`;
    backButton.disabled = index === 0;
    nextButtons.forEach((button) => { button.disabled = selected === undefined; });
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
          nextButtons.forEach((button) => { button.disabled = false; });
          persist();
        });
        const number = document.createElement("span");
        number.className = "answer-number";
        number.textContent = String(optionIndex + 1);
        const copy = document.createElement("span");
        copy.className = "answer-copy";
        const strong = document.createElement("strong");
        strong.textContent = option.label;
        copy.append(strong);
        label.append(input, number, copy);
        return label;
      })
    );
  };

  const profileSummary = (result: TestResult): string => {
    if (result.isOpenEnded) return "No single role scored high enough to become your main match. Your individual role and preference scores may be more useful than one label.";
    if (result.isBlended) {
      return result.primary
        .split(" / ")
        .map((id) => profiles.find((profile) => profile.id === id)?.summary)
        .filter(Boolean)
        .join(" ");
    }
    return profiles.find((profile) => profile.id === result.primary)?.summary ?? "Your result is based on the role and preference scores below.";
  };

  const updateShareChannels = (result: TestResult): void => {
    const url = createShareUrl(result);
    const text = `I took the BDSM Test and got ${result.primary}. Compare my scores and take the test yourself.`;
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
    renderRoleRows(required<HTMLElement>(root, "[data-role-results]"), result.profileScores);
    renderRadar(required<HTMLElement>(root, "[data-result-radar]"), result.dimensions);
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
    delete root.dataset.hasResume;
    root.dataset.hasResult = "true";
    const roleGrid = required<HTMLElement>(root, "[data-role-results]");
    roleGrid.classList.remove("is-expanded");
    const roleToggle = required<HTMLButtonElement>(root, "[data-action='toggle-roles']");
    roleToggle.textContent = "Show all 10 matches";
    roleToggle.setAttribute("aria-expanded", "false");
    showView("result");
  };

  const renderSharedResult = (payload: SharePayloadV1): void => {
    setText(root, "[data-shared-primary]", payload.p);
    const scores = Object.fromEntries(dimensions.map((dimension, index) => [dimension.id, payload.a[index]])) as Record<DimensionId, number>;
    renderDimensionRows(required<HTMLElement>(root, "[data-shared-dimensions]"), scores);
    renderRadar(required<HTMLElement>(root, "[data-shared-radar]"), scores);
    const roleSection = required<HTMLElement>(root, "[data-shared-role-section]");
    roleSection.hidden = !payload.c;
    required<HTMLDetailsElement>(root, ".shared-dimensions").open = !payload.c;
    if (payload.c) {
      const roleScores = Object.fromEntries(PROFILE_IDS.map((profile, index) => [profile, payload.c![index]])) as Record<ProfileId, number>;
      renderRoleRows(required<HTMLElement>(root, "[data-shared-role-results]"), roleScores);
    }
    showView("shared");
  };

  const beginQuiz = (resume: boolean): void => {
    if (resume && Object.keys(answers).length > 0) {
      // Keep the in-memory state after an explicit Save & exit action.
    } else if (resume && session) {
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
    const text = `I took the BDSM Test and got ${currentResult.primary}. Compare my scores and take the test yourself.`;
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
    shareStatus.textContent = copied ? "Result link copied." : "We couldn't copy automatically. The link is selected for you.";
  };

  const shareImage = async (): Promise<void> => {
    if (!currentResult) return;
    shareStatus.textContent = "Creating your result image…";
    const blob = await getImage();
    const file = new File([blob], "my-bdsm-test-result.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: "My BDSM Test result", text: "My BDSM Test role scores.", files: [file] });
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
        case "exit":
          persist();
          if (Object.keys(answers).length > 0) showResumeState(index);
          showView("intro");
          break;
        case "back":
          if (index > 0) {
            index -= 1;
            persist();
            renderQuestion();
          }
          break;
        case "next": goNext(); break;
        case "retake":
          clearLocalTestData();
          currentResult = null;
          boundaries = {};
          answers = {};
          index = 0;
          delete root.dataset.hasResume;
          delete root.dataset.hasResult;
          required<HTMLElement>(root, "[data-resume]").hidden = true;
          required<HTMLElement>(root, "[data-saved-result]").hidden = true;
          confirmationInputs.forEach((input) => { input.checked = false; });
          required<HTMLButtonElement>(root, "[data-action='confirm']").disabled = true;
          showView("gate");
          break;
        case "boundary":
          required<HTMLElement>(root, "[data-boundary-map]").hidden = false;
          required<HTMLElement>(root, "[data-boundary-map]").scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        case "scroll-share": required<HTMLElement>(root, ".share-panel").scrollIntoView({ behavior: "smooth", block: "start" }); break;
        case "toggle-roles": {
          const grid = required<HTMLElement>(root, "[data-role-results]");
          const expanded = grid.classList.toggle("is-expanded");
          target.textContent = expanded ? "Show top 3 only" : "Show all 10 matches";
          target.setAttribute("aria-expanded", String(expanded));
          break;
        }
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
      shareStatus.textContent = "This browser could not complete that action. Your result has not changed.";
    }
  });

  confirmationInputs.forEach((input) => input.addEventListener("change", () => {
    required<HTMLButtonElement>(root, "[data-action='confirm']").disabled = !confirmationInputs.every((item) => item.checked);
  }));

  form.addEventListener("submit", (event) => event.preventDefault());

  root.addEventListener("keydown", (event) => {
    if (root.dataset.state !== "quiz") return;
    const number = Number(event.key);
    if (number >= 1 && number <= 5) {
      const input = answerList.querySelectorAll<HTMLInputElement>("input")[number - 1];
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      event.preventDefault();
    } else if (event.key === "Enter") {
      goNext();
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
