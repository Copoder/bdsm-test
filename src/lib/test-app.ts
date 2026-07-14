import { dimensions, answerOptions, questionOrder, QUESTION_VERSION } from "../data/questions";
import { profiles } from "../data/profiles";
import type { Answers, DimensionId, TestResult } from "./model";
import { scoreTest } from "./scoring";
import { clearLocalTestData, isStorageAvailable, loadSession, saveResult, saveSession } from "./storage";

type View = "intro" | "gate" | "quiz" | "result";

const required = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Test UI is missing ${selector}`);
  return element;
};

const setText = (root: ParentNode, selector: string, value: string): void => {
  required<HTMLElement>(root, selector).textContent = value;
};

export function initTestApp(root: HTMLElement): void {
  let index = 0;
  let answers: Answers = {};
  let storageEnabled = isStorageAvailable();
  const session = storageEnabled ? loadSession() : null;
  const form = required<HTMLFormElement>(root, "[data-question-form]");
  const continueButton = required<HTMLButtonElement>(form, ".continue-button");
  const answerList = required<HTMLElement>(form, "[data-answer-list]");
  const backButton = required<HTMLButtonElement>(root, "[data-action='back']");
  const confirmationInputs = [...root.querySelectorAll<HTMLInputElement>("[data-confirm]")];

  if (!storageEnabled) required<HTMLElement>(root, "[data-storage-note]").hidden = false;
  if (session && Object.keys(session.answers).length > 0) required<HTMLElement>(root, "[data-resume]").hidden = false;

  const showView = (view: View): void => {
    root.dataset.state = view;
    root.querySelectorAll<HTMLElement>("[data-view]").forEach((element) => {
      element.hidden = element.dataset.view !== view;
    });
    document.body.classList.toggle("test-active", view === "quiz");
    if (view !== "intro") root.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const persist = (): void => {
    if (!storageEnabled) return;
    storageEnabled = saveSession({ schemaVersion: 1, questionVersion: QUESTION_VERSION, index, answers });
    if (!storageEnabled) required<HTMLElement>(root, "[data-storage-note]").hidden = false;
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
      const summaries = result.primary.split(" / ").map((id) => profiles.find((profile) => profile.id === id)?.summary).filter(Boolean);
      return summaries.join(" ");
    }
    return profiles.find((profile) => profile.id === result.primary)?.summary ?? "Your current preferences form a distinct pattern across the eight dimensions.";
  };

  const renderResult = (result: TestResult): void => {
    setText(root, "[data-result-primary]", result.primary);
    setText(root, "[data-result-summary]", profileSummary(result));
    const secondary = required<HTMLElement>(root, "[data-result-secondary]");
    secondary.hidden = !result.secondary;
    secondary.textContent = result.secondary ? `Secondary tendency: ${result.secondary}` : "";
    const dimensionResults = required<HTMLElement>(root, "[data-dimension-results]");
    dimensionResults.replaceChildren(...dimensions.map((dimension) => {
      const row = document.createElement("div");
      row.className = "dimension-row";
      const label = document.createElement("span");
      label.textContent = dimension.shortName;
      const bar = document.createElement("span");
      bar.className = "dimension-bar";
      const fill = document.createElement("span");
      fill.style.setProperty("--score", `${result.dimensions[dimension.id]}%`);
      fill.style.setProperty("--bar-color", dimension.color);
      bar.append(fill);
      const score = document.createElement("strong");
      score.textContent = String(result.dimensions[dimension.id]);
      row.append(label, bar, score);
      return row;
    }));
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
    saveResult(result);
    showView("result");
  };

  const beginQuiz = (resume: boolean): void => {
    if (resume && session) {
      index = session.index;
      answers = session.answers;
    } else {
      index = 0;
      answers = {};
      clearLocalTestData();
    }
    renderQuestion();
    showView("quiz");
    required<HTMLElement>(root, "[data-question-text]").focus?.();
  };

  root.addEventListener("click", (event) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-action]");
    if (!target) return;
    switch (target.dataset.action) {
      case "start": showView("gate"); break;
      case "gate-back": showView("intro"); break;
      case "confirm": beginQuiz(false); break;
      case "resume": beginQuiz(true); break;
      case "restart": showView("gate"); break;
      case "back":
        if (index > 0) {
          index -= 1;
          persist();
          renderQuestion();
        }
        break;
      case "retake":
        clearLocalTestData();
        answers = {};
        index = 0;
        confirmationInputs.forEach((input) => { input.checked = false; });
        required<HTMLButtonElement>(root, "[data-action='confirm']").disabled = true;
        showView("gate");
        break;
      case "boundary":
        required<HTMLElement>(root, "[data-boundary-placeholder]").hidden = false;
        break;
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
    form.scrollIntoView({ behavior: "smooth", block: "start" });
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
}
