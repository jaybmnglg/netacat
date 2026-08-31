const state = {
  title: "",
  questions: [],
  order: [],
  current: 0,
  reviewMode: false,
  peeking: false,
  showResults: false
};

const el = {
  importForm: document.querySelector("#importForm"),
  importer: document.querySelector("#importer"),
  workspace: document.querySelector(".workspace"),
  urlInput: document.querySelector("#urlInput"),
  pasteInput: document.querySelector("#pasteInput"),
  themeToggle: document.querySelector("#themeToggle"),
  loadUrlButton: document.querySelector("#loadUrlButton"),
  loadPasteButton: document.querySelector("#loadPasteButton"),
  importStatus: document.querySelector("#importStatus"),
  scoreValue: document.querySelector("#scoreValue"),
  answeredValue: document.querySelector("#answeredValue"),
  totalValue: document.querySelector("#totalValue"),
  questionList: document.querySelector("#questionList"),
  shuffleButton: document.querySelector("#shuffleButton"),
  reviewButton: document.querySelector("#reviewButton"),
  resetButton: document.querySelector("#resetButton"),
  questionCounter: document.querySelector("#questionCounter"),
  typeBadge: document.querySelector("#typeBadge"),
  questionText: document.querySelector("#questionText"),
  imageStrip: document.querySelector("#imageStrip"),
  matchingPanel: document.querySelector("#matchingPanel"),
  choicesForm: document.querySelector("#choicesForm"),
  choiceTemplate: document.querySelector("#choiceTemplate"),
  prevButton: document.querySelector("#prevButton"),
  holdAnswerButton: document.querySelector("#holdAnswerButton"),
  nextButton: document.querySelector("#nextButton"),
  explanationPanel: document.querySelector("#explanationPanel"),
  explanationPlaceholder: document.querySelector("#explanationPlaceholder"),
  answerLine: document.querySelector("#answerLine"),
  explanationText: document.querySelector("#explanationText"),
  quizPanel: document.querySelector(".quiz-panel"),
  questionContainer: document.querySelector("#questionContainer"),
  resultsPanel: document.querySelector("#resultsPanel"),
  resultsBadge: document.querySelector("#resultsBadge"),
  resultsSubtitle: document.querySelector("#resultsSubtitle"),
  finalScoreVal: document.querySelector("#finalScoreVal"),
  finalPercentVal: document.querySelector("#finalPercentVal"),
  correctCountVal: document.querySelector("#correctCountVal"),
  wrongCountVal: document.querySelector("#wrongCountVal"),
  breakdownList: document.querySelector("#breakdownList"),
  resultsBackBtn: document.querySelector("#resultsBackBtn"),
  resultsReviewBtn: document.querySelector("#resultsReviewBtn"),
  resultsResetBtn: document.querySelector("#resultsResetBtn"),
  resetConfirmModal: document.querySelector("#resetConfirmModal"),
  resetModalBackdrop: document.querySelector("#resetModalBackdrop"),
  cancelResetBtn: document.querySelector("#cancelResetBtn"),
  confirmResetBtn: document.querySelector("#confirmResetBtn")
};

initTheme();

if (el.importForm) {
  el.importForm.addEventListener("submit", (e) => {
    e.preventDefault();
    importFromUrl();
  });
}
el.loadUrlButton.addEventListener("click", (e) => {
  e.preventDefault();
  importFromUrl();
});
el.loadPasteButton.addEventListener("click", importFromPaste);
el.themeToggle.addEventListener("change", () => {
  setTheme(el.themeToggle.checked ? "dark" : "light");
});
el.shuffleButton.addEventListener("click", () => {
  shuffleOrder();
  state.current = 0;
  render();
});
el.reviewButton.addEventListener("click", () => {
  state.reviewMode = !state.reviewMode;
  el.reviewButton.textContent = state.reviewMode ? "Practice" : "Review";
  render();
});
el.resetButton.addEventListener("click", openResetConfirmModal);

if (el.resultsResetBtn) {
  el.resultsResetBtn.addEventListener("click", openResetConfirmModal);
}
if (el.cancelResetBtn) {
  el.cancelResetBtn.addEventListener("click", closeResetConfirmModal);
}
if (el.resetModalBackdrop) {
  el.resetModalBackdrop.addEventListener("click", closeResetConfirmModal);
}
if (el.confirmResetBtn) {
  el.confirmResetBtn.addEventListener("click", () => {
    resetQuizProgress();
    closeResetConfirmModal();
  });
}
if (el.resultsBackBtn) {
  el.resultsBackBtn.addEventListener("click", () => {
    if (state.order.length > 0) {
      state.current = state.order.length - 1;
      state.showResults = false;
      render();
    }
  });
}
if (el.resultsReviewBtn) {
  el.resultsReviewBtn.addEventListener("click", () => {
    state.showResults = false;
    state.reviewMode = true;
    el.reviewButton.textContent = "Practice";
    state.current = 0;
    render();
  });
}

function openResetConfirmModal() {
  if (el.resetConfirmModal) el.resetConfirmModal.hidden = false;
}

function closeResetConfirmModal() {
  if (el.resetConfirmModal) el.resetConfirmModal.hidden = true;
}

function resetQuizProgress() {
  state.questions.forEach((question) => {
    question.selected = [];
    question.userMatches = {};
    question.selectedSourceId = null;
    question.checked = false;
    question.correct = false;
  });
  state.showResults = false;
  state.current = 0;
  render();
}
el.prevButton.addEventListener("click", () => {
  if (state.current > 0) {
    state.current--;
    render();
  }
});
el.nextButton.addEventListener("click", () => {
  if (state.current < state.order.length) {
    state.current++;
    render();
  }
});

function startPeeking() {
  if (state.peeking) return;
  state.peeking = true;
  if (el.holdAnswerButton) el.holdAnswerButton.classList.add("peeking");
  render();
}

function stopPeeking() {
  if (!state.peeking) return;
  state.peeking = false;
  if (el.holdAnswerButton) el.holdAnswerButton.classList.remove("peeking");
  render();
}

const modalEl = document.querySelector("#imageModal");
const modalImg = document.querySelector("#modalImage");
const closeBtn = document.querySelector("#closeImageModal");
const backdrop = document.querySelector("#modalBackdrop");

function openImageModal(src) {
  if (!modalEl || !modalImg) return;
  modalImg.src = src;
  modalEl.hidden = false;
}

function closeImageModal() {
  if (modalEl) modalEl.hidden = true;
}

if (closeBtn) closeBtn.addEventListener("click", closeImageModal);
if (backdrop) backdrop.addEventListener("click", closeImageModal);

if (el.holdAnswerButton) {
  el.holdAnswerButton.addEventListener("mousedown", startPeeking);
  el.holdAnswerButton.addEventListener("mouseup", stopPeeking);
  el.holdAnswerButton.addEventListener("mouseleave", stopPeeking);
  el.holdAnswerButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startPeeking();
  });
  el.holdAnswerButton.addEventListener("touchend", stopPeeking);
  el.holdAnswerButton.addEventListener("touchcancel", stopPeeking);
}

window.addEventListener("keydown", (e) => {
  if (el.workspace.hidden) return;
  if (e.target.matches("input, textarea")) return;

  if (e.key.toLowerCase() === "h" || e.key.toLowerCase() === "a") {
    e.preventDefault();
    startPeeking();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (state.current > 0) {
      state.current--;
      render();
    }
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    if (state.current < state.order.length) {
      state.current++;
      render();
    }
  } else if (e.key === "Enter" || e.key === " ") {
    if (!el.nextButton.disabled) {
      e.preventDefault();
      el.nextButton.click();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "h" || e.key.toLowerCase() === "a") {
    stopPeeking();
  }
});

async function importFromUrl() {
  const url = el.urlInput.value.trim();
  if (!url) return setStatus("Add a URL first.", true);

  setBusy(true);
  setStatus("Fetching page through the local proxy...");
  try {
    const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
    const payload = await response.json();
    if (!payload.ok) {
      const errMsg = payload.error || `HTTP ${payload.status || response.status}`;
      throw new Error(`Fetch failed (${errMsg}). Try pasted HTML/text fallback.`);
    }

    const exam = parseExam(payload.html, payload.finalUrl || url);
    await maybeMergeAnswerPage(exam, payload.html, payload.finalUrl || url);
    loadExam(exam);
  } catch (error) {
    setStatus(`${error.message}`, true);
  } finally {
    setBusy(false);
  }
}

function importFromPaste() {
  const content = el.pasteInput.value.trim();
  if (!content) return setStatus("Paste page HTML or copied article text first.", true);
  const baseUrl = el.urlInput.value.trim() || location.href;
  try {
    loadExam(parseExam(content, baseUrl));
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function maybeMergeAnswerPage(exam, html, baseUrl) {
  let answerUrl = null;

  // Strategy 1: Replace -test-online with -exam-answers
  if (baseUrl.includes("-test-online")) {
    answerUrl = baseUrl.replace("-test-online", "-exam-answers");
  }

  // Strategy 2: Search within article/content for relevant answer links
  if (!answerUrl) {
    const document = htmlToDocument(html);
    const root = document.querySelector("article") || document.querySelector(".thecontent") || document.querySelector("main") || document.body;
    const answerLink = [...root.querySelectorAll("a")]
      .map((link) => ({ text: clean(link.textContent), href: link.getAttribute("href") }))
      .find((link) => /exam-answers|answers/i.test(link.href || "") && !/test-online/i.test(link.href || ""));

    if (answerLink?.href) {
      try {
        answerUrl = new URL(answerLink.href, baseUrl).href;
      } catch {}
    }
  }

  if (!answerUrl) return;

  try {
    setStatus("Found linked answers page; importing explanations and answer keys...");
    const response = await fetch(`/api/fetch?url=${encodeURIComponent(answerUrl)}`);
    const payload = await response.json();
    if (!payload.ok) return;
    const answerExam = parseExam(payload.html, answerUrl);
    mergeAnswers(exam, answerExam);
  } catch {
    // If answer page merge fails, continue with base exam
  }
}

function loadExam(exam) {
  state.title = exam.title;
  state.current = 0;
  state.reviewMode = false;
  state.peeking = false;
  state.showResults = false;
  el.reviewButton.textContent = "Review";
  state.questions = exam.questions.map((question, index) => {
    let matchingData = question.matchingData;
    if (matchingData && matchingData.targets?.length && matchingData.sources?.length) {
      matchingData = {
        targets: matchingData.targets.map((t) => ({ ...t })),
        sources: shuffle(matchingData.sources.map((s) => ({ ...s })))
      };
    }
    return {
      ...question,
      id: index + 1,
      selected: [],
      userMatches: {},
      selectedSourceId: null,
      checked: false,
      correct: false,
      matchingData,
      choices: shuffle((question.choices || []).map((choice, choiceIndex) => ({ ...choice, originalIndex: choiceIndex })))
    };
  });

  if (!state.questions.length) {
    throw new Error("No questions were detected. Try pasting the visible article text instead of page HTML.");
  }

  shuffleOrder();
  el.workspace.hidden = false;
  setStatus(`Imported ${state.questions.length} questions from ${exam.title || "the page"}.`);
  render();
}

function parseExam(content, baseUrl) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const document = isHtml ? htmlToDocument(content) : textToDocument(content);
  const title = clean(document.querySelector("h1")?.textContent || document.title || "Imported Exam");
  const root = document.querySelector("article") || document.querySelector(".thecontent") || document.querySelector("main") || document.body;
  const answerKey = isHtml ? extractWpProQuizAnswerKey(content) : new Map();

  normalizeImages(root, baseUrl);
  const structuredQuestions = parseStructuredBlocks(root, answerKey);
  const articleQuestions = structuredQuestions.length ? [] : parseArticleBlocks(root);
  const questions = structuredQuestions.length
    ? structuredQuestions
    : articleQuestions.length
      ? articleQuestions
      : parseNumberedText(root, baseUrl);

  return {
    title,
    sourceUrl: baseUrl,
    questions: dedupeQuestions(questions).map((question) => normalizeQuestion(question))
  };
}

function parseStructuredBlocks(root, answerKey = new Map()) {
  let blocks = [...root.querySelectorAll(".wpProQuiz_listItem")];
  if (!blocks.length) {
    blocks = [...root.querySelectorAll(".watupro-question, .watu-question, .quiz-question")];
  }
  if (!blocks.length) {
    blocks = [...root.querySelectorAll(".question")]
      .filter((node) => {
        const text = clean(node.textContent);
        return text.length > 35 && !/quiz-summary|questions:\s*1\s*2\s*3/i.test(text);
      });
  }

  const parsed = blocks.map((block) => {
    const questionList = block.querySelector(".wpProQuiz_questionList,[data-question_id]");
    const questionId = questionList?.getAttribute("data-question_id");
    const qTypeAttr = questionList?.getAttribute("data-type");
    const key = questionId ? answerKey.get(questionId) : null;
    const qType = qTypeAttr || key?.type;

    const questionText = clean(
      block.querySelector(".wpProQuiz_question_text, .question-content, h2, h3, h4")?.textContent ||
      stripChoiceText(block)
    );
    const images = extractImages(block);
    const explanation = extractExplanation(block.textContent);

    const isMatrix = qType === "matrix_sort_answer" || !!block.querySelector(".wpProQuiz_matrixSortString");
    const isSort = qType === "sort_answer";

    if (isMatrix || isSort) {
      const matchingData = extractMatchingDataFromNode(block, isSort);
      return {
        prompt: cleanupPrompt(questionText),
        choices: [],
        matchingData,
        images,
        explanation,
        type: "matching"
      };
    }

    const choices = extractChoicesFromNode(block, key);
    return {
      prompt: cleanupPrompt(questionText),
      choices,
      matchingData: null,
      images,
      explanation,
      type: key?.type || "single"
    };
  }).filter((question) => question.prompt && (question.choices.length >= 2 || question.matchingData?.targets?.length));

  return parsed.length >= 3 ? parsed : [];
}

function extractMatchingDataFromNode(block, isSort = false) {
  if (isSort) {
    const sortItems = [...block.querySelectorAll(".wpProQuiz_questionListItem, .wpProQuiz_sortStringItem")];
    const targets = sortItems.map((_, idx) => ({
      id: idx,
      text: `Step ${idx + 1}`,
      correctSourceIds: [idx]
    }));
    const sources = sortItems.map((item, idx) => {
      const posAttr = item.getAttribute("data-pos");
      const id = posAttr !== null && posAttr !== undefined ? Number(posAttr) : idx;
      return { id, text: clean(item.textContent) };
    }).filter((s) => s.text);

    return { targets, sources };
  }

  const targetNodes = [...block.querySelectorAll(".wpProQuiz_questionListItem")];
  const targets = targetNodes.map((tNode, tIdx) => {
    const posAttr = tNode.getAttribute("data-pos");
    const id = posAttr !== null && posAttr !== undefined ? Number(posAttr) : tIdx;

    let textNode = tNode.querySelector(".wpProQuiz_maxtrixSortText");
    let text = "";
    if (textNode) {
      text = clean(textNode.textContent);
    } else {
      const clone = tNode.cloneNode(true);
      clone.querySelectorAll(".wpProQuiz_sortStringList, .wpProQuiz_sortStringCriterion, ul, ol").forEach((el) => el.remove());
      text = clean(clone.textContent);
    }
    return { id, text, correctSourceIds: [] };
  }).filter((t) => t.text);

  const sourceNodes = [...block.querySelectorAll(".wpProQuiz_sortStringItem")];
  const sources = sourceNodes.map((sNode, sIdx) => {
    const posAttr = sNode.getAttribute("data-pos");
    const id = posAttr !== null && posAttr !== undefined ? Number(posAttr) : sIdx;
    const correctAttr = sNode.getAttribute("data-correct") || "";
    const correctSlots = correctAttr
      ? correctAttr.split(",").map((v) => Number(v.trim())).filter((v) => !isNaN(v))
      : [id];
    const text = clean(sNode.textContent);

    correctSlots.forEach((targetId) => {
      const target = targets.find((t) => String(t.id) === String(targetId));
      if (target && !target.correctSourceIds.map(String).includes(String(id))) {
        target.correctSourceIds.push(id);
      }
    });

    return { id, text, correctSlots };
  }).filter((s) => s.text);

  targets.forEach((target) => {
    if (!target.correctSourceIds.length) {
      target.correctSourceIds = [target.id];
    }
  });

  return { targets, sources };
}

function parseArticleBlocks(root) {
  const questionNodes = [...root.querySelectorAll("p,h2,h3,h4,h5")]
    .filter((node) => /^\s*\d+\.\s+/.test(clean(node.textContent)));

  const parsed = questionNodes.map((node) => {
    const number = Number(clean(node.textContent).match(/^\s*(\d+)/)?.[1] || 0);
    const nodes = [];
    let cursor = node.nextElementSibling;

    while (cursor && !/^\s*\d+\.\s+/.test(clean(cursor.textContent))) {
      nodes.push(cursor);
      cursor = cursor.nextElementSibling;
    }

    const choices = [];
    const images = extractImagesFromNodes([node, ...nodes]);
    const explanationParts = [];
    const matches = [];

    for (const sibling of nodes) {
      if (sibling.matches("ul,ol")) {
        sibling.querySelectorAll(":scope > li").forEach((item) => {
          choices.push(choiceFromText(clean(item.textContent), item));
        });
      }

      const siblingText = clean(sibling.textContent);
      if (/Explanation\s*:/i.test(siblingText) || sibling.matches("[class*='message_box'],[class*='success']")) {
        explanationParts.push(siblingText.replace(/^Explanation\s*:?\s*/i, ""));
      }

      if (/Place the options in the following order/i.test(siblingText)) {
        sibling.querySelectorAll("li").forEach((item) => matches.push(clean(item.textContent)));
      }
    }

    let matchingData = null;
    if (matches.length) {
      const targets = matches.map((_, idx) => ({ id: idx, text: `Step ${idx + 1}`, correctSourceIds: [idx] }));
      const sources = matches.map((text, idx) => ({ id: idx, text }));
      matchingData = { targets, sources };
    }

    return {
      number,
      prompt: cleanupPrompt(clean(node.textContent)),
      choices,
      matchingData,
      images,
      explanation: clean(explanationParts.join("\n")),
      matches: matches.filter(Boolean),
      type: matchingData ? "matching" : undefined
    };
  }).filter((question) => question.prompt && (question.choices.length >= 2 || question.matchingData?.targets?.length));

  return parsed.length >= 3 ? parsed : [];
}

function stripChoiceText(block) {
  const clone = block.cloneNode(true);
  clone.querySelectorAll("ul,ol,input,label,.answer,.answers,.wpProQuiz_questionList").forEach((node) => node.remove());
  return clone.textContent;
}

function extractChoicesFromNode(block, answerKey) {
  let candidates = [...block.querySelectorAll(".wpProQuiz_questionListItem")];
  if (!candidates.length) {
    candidates = [...block.querySelectorAll("li")];
  }
  if (!candidates.length) {
    candidates = [...block.querySelectorAll(".answer, .answers > div, label")];
  }

  return candidates
    .map((node, index) => {
      const posAttr = node.getAttribute?.("data-pos");
      const position = posAttr !== null && posAttr !== undefined ? Number(posAttr) : index;
      const choice = choiceFromText(clean(node.textContent), node);
      if (answerKey?.correct?.length && position < answerKey.correct.length) {
        choice.correct = Boolean(answerKey.correct[position]);
      }
      return choice;
    })
    .filter((choice) => choice.text && !/^correct$|^incorrect$|^\[input\]$/i.test(choice.text));
}

function extractWpProQuizAnswerKey(content) {
  const key = new Map();
  const candidates = [content];

  // Extract from script data URIs (e.g. src="data:text/javascript,...")
  const dataScripts = [...content.matchAll(/src=["']data:text\/javascript,([^"']+)["']/gi)];
  for (const m of dataScripts) {
    try {
      candidates.push(decodeURIComponent(m[1]));
    } catch {}
  }

  // Extract from inline script tags
  const inlineScripts = [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of inlineScripts) {
    candidates.push(m[1]);
  }

  for (const candidate of candidates) {
    const pattern = /"(\d+)"\s*:\s*\{\s*"type"\s*:\s*"([^"]+)"[\s\S]*?"correct"\s*:\s*\[([^\]]*)\]/g;
    let match;
    while ((match = pattern.exec(candidate))) {
      const correctRaw = match[3].trim();
      const correct = correctRaw ? correctRaw.split(",").map((value) => Number(value.trim())) : [];
      key.set(match[1], {
        type: match[2],
        correct
      });
    }
  }
  return key;
}

function parseNumberedText(root, baseUrl) {
  const text = cleanLines(root.innerText || root.textContent || "");
  const blocks = splitQuestionBlocks(text);
  const imagesByQuestion = mapImagesNearQuestions(root, baseUrl);

  return blocks.map((block) => {
    const lines = block.split("\n").map(clean).filter(Boolean);
    const first = lines.shift() || "";
    const promptLines = [];
    const choiceLines = [];
    const matchLines = [];
    let explanationLines = [];
    let mode = "prompt";

    for (const line of lines) {
      if (/^(Correct|Incorrect|\[Input\]|Quiz is loading|You must sign in)/i.test(line)) continue;
      if (/^Explanation\s*:?\s*/i.test(line)) {
        mode = "explanation";
        explanationLines.push(line.replace(/^Explanation\s*:?\s*/i, ""));
        continue;
      }
      if (/^Place the options in the following order/i.test(line)) {
        mode = "matching";
        continue;
      }
      if (mode === "explanation") {
        explanationLines.push(line);
      } else if (mode === "matching") {
        matchLines.push(line.replace(/^[-*]\s*/, ""));
      } else if (looksLikeChoice(line)) {
        choiceLines.push(line);
      } else {
        promptLines.push(line);
      }
    }

    const number = Number(first.match(/^(\d+)/)?.[1] || 0);
    const prompt = cleanupPrompt(promptLines.join(" "));
    const choices = choiceLines.map((line) => choiceFromText(line));
    const type = matchLines.length ? "matching" : undefined;

    return {
      number,
      prompt,
      choices,
      images: imagesByQuestion.get(number) || [],
      explanation: clean(explanationLines.join("\n")),
      matches: matchLines,
      type
    };
  }).filter((question) => question.prompt && (question.choices.length >= 2 || question.matches?.length));
}

function splitQuestionBlocks(text) {
  const normalized = text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/Question\s+(\d+)\s+of\s+\d+/gi, "\n$1. Question\n")
    .replace(/^(\d+)\.\s+/gm, "\n$1. ");

  const parts = normalized
    .split(/\n(?=\d+\.\s*(?:Question\b|[A-Z0-9"“]))/g)
    .map((part) => part.trim());

  return parts.filter((part) => /^\d+\./.test(part));
}

function looksLikeChoice(line) {
  if (/^(Explanation|Topic|Image|Refer to|Question|Time limit|Results|Your time|\d+\s*points?)/i.test(line)) return false;
  return /^\[Input\]\s+/.test(line) ||
    /^[-*•]\s+/.test(line) ||
    /^(\u2022|\u25aa|\u25cf)\s+/.test(line) ||
    /\*\s*$/.test(line);
}

function choiceFromText(raw, node) {
  let text = raw
    .replace(/^\[Input\]\s*/i, "")
    .replace(/^[-*•]\s*/, "")
    .trim();

  const trailingStar = /\*\s*$/.test(text);
  text = text.replace(/\*\s*$/, "").trim();

  const className = node?.className?.toString() || "";
  const style = node?.getAttribute?.("style") || "";
  const hasCorrectClass = /(?:^|\s|-|_)(?:correct|correct_answer|right|is-correct)(?:$|\s|-|_)/i.test(className);
  const hasCorrectChild = Boolean(node?.querySelector?.(".correct_answer, .correct, [class*='correct_answer']"));
  const hasColoredStyle = /color\s*:\s*(red|#f00|#ff0000|green|#008000)/i.test(style);
  const correctish = hasCorrectClass || hasCorrectChild || hasColoredStyle || trailingStar;

  return {
    text,
    correct: correctish
  };
}

function fixZeroCorrectChoices(question) {
  if (!question.choices || !question.choices.length) return;

  // Fallback for SSH login local question
  if (question.prompt && /login local/i.test(question.prompt)) {
    const targetChoice = question.choices.find((c) => /username\s+username\s+secret\s+secret/i.test(c.text));
    if (targetChoice) {
      question.choices.forEach((c) => (c.correct = false));
      targetChoice.correct = true;
      return;
    }
  }

  const correctCount = question.choices.filter((c) => c.correct).length;
  if (correctCount > 0) return;

  const text = (question.explanation || "") + " " + (question.prompt || "");

  // Check if explanation contains exact choice text
  for (const choice of question.choices) {
    if (choice.text && choice.text.length > 3 && text.toLowerCase().includes(choice.text.toLowerCase())) {
      choice.correct = true;
      return;
    }
  }

  // General fallback: if still 0 correct and explanation mentions "Answer:" or "Correct:"
  const ansMatch = (question.explanation || "").match(/(?:Answer|CorrectAnswer|Correct)\s*:\s*([A-E]|\d+|[^\n.]+)/i);
  if (ansMatch) {
    const ans = ansMatch[1].trim();
    if (/^[A-E]$/i.test(ans)) {
      const idx = ans.toUpperCase().charCodeAt(0) - 65;
      if (question.choices[idx]) {
        question.choices[idx].correct = true;
        return;
      }
    }
    for (const choice of question.choices) {
      if (choice.text && ans.toLowerCase().includes(choice.text.toLowerCase())) {
        choice.correct = true;
        return;
      }
    }
  }
}

function fixMatchingQuestionData(question) {
  if (!question.matchingData || !question.matchingData.targets?.length || !question.matchingData.sources?.length) return;

  const promptText = (question.prompt || "").toLowerCase();

  // Correction for Question 19156 (Layer 2 frame with MAC address 000b.a023.c501)
  if (promptText.includes("000b.a023.c501") || (promptText.includes("layer 2 frame") && promptText.includes("mac address"))) {
    const targetFirst = question.matchingData.targets.find((t) => t.text.toLowerCase().includes("occurs first"));
    const targetSecond = question.matchingData.targets.find((t) => t.text.toLowerCase().includes("occurs second"));

    const sourceAddMac = question.matchingData.sources.find((s) => s.text.toLowerCase().includes("adds the source mac"));
    const sourceForward = question.matchingData.sources.find((s) => s.text.toLowerCase().includes("forwards the frame"));

    if (targetFirst && sourceAddMac) {
      targetFirst.correctSourceIds = [sourceAddMac.id];
    }
    if (targetSecond && sourceForward) {
      targetSecond.correctSourceIds = [sourceForward.id];
    }
  }
}

function normalizeQuestion(question) {
  fixZeroCorrectChoices(question);
  const correctCount = question.choices.filter((choice) => choice.correct).length;
  const chooseMatch = question.prompt.match(/\(Choose\s+(\w+|\d+)\.?\)/i);
  const chooseCount = chooseMatch ? wordToNumber(chooseMatch[1]) : correctCount || 1;
  const type = question.type || (question.matches?.length ? "matching" : chooseCount > 1 ? "multi" : "single");

  let matchingData = question.matchingData;
  if (type === "matching" && (!matchingData || !matchingData.targets?.length)) {
    matchingData = buildMatchingData(question);
  }

  const normalized = {
    number: question.number || null,
    prompt: question.prompt,
    choices: question.choices,
    matchingData,
    images: question.images || [],
    explanation: question.explanation || "",
    matches: question.matches || [],
    chooseCount,
    type
  };

  if (normalized.type === "matching") {
    fixMatchingQuestionData(normalized);
  }

  return normalized;
}

function buildMatchingData(question) {
  const matches = question.matches || [];
  if (matches.length > 0) {
    const targets = [];
    const sources = [];

    matches.forEach((item, idx) => {
      const parts = item.split(/\s*(?:->|=>|→|:)\s*/);
      if (parts.length >= 2) {
        targets.push({ id: idx, text: parts[0].trim(), correctSourceIds: [idx] });
        sources.push({ id: idx, text: parts.slice(1).join(" : ").trim() });
      } else {
        targets.push({ id: idx, text: `Step ${idx + 1}`, correctSourceIds: [idx] });
        sources.push({ id: idx, text: item.trim() });
      }
    });

    if (targets.length) {
      return { targets, sources };
    }
  }

  if (question.choices && question.choices.length > 0) {
    const targets = question.choices.map((c, idx) => ({
      id: idx,
      text: `Item ${idx + 1}`,
      correctSourceIds: [idx]
    }));
    const sources = question.choices.map((c, idx) => ({
      id: idx,
      text: c.text
    }));
    return { targets, sources };
  }

  return null;
}

function mergeAnswers(target, answerExam) {
  const byPrompt = new Map(answerExam.questions.map((question) => [fingerprint(question.prompt), question]));
  target.questions.forEach((question) => {
    const match = byPrompt.get(fingerprint(question.prompt));
    if (!match) return;

    if (match.explanation && !question.explanation) question.explanation = match.explanation;
    if (match.images?.length && !question.images?.length) question.images = match.images;
    if (match.matches?.length) question.matches = match.matches;

    const correctTexts = new Set(match.choices.filter((choice) => choice.correct).map((choice) => fingerprint(choice.text)));
    if (correctTexts.size) {
      question.choices.forEach((choice) => {
        choice.correct = correctTexts.has(fingerprint(choice.text));
      });
    }
  });
}

function render() {
  state.showResults = (state.current === state.order.length);
  renderStats();
  renderQuestionList();

  if (state.showResults) {
    if (el.questionContainer) el.questionContainer.hidden = true;
    if (el.resultsPanel) {
      el.resultsPanel.hidden = false;
      el.resultsPanel.classList.remove("question-animating");
      void el.resultsPanel.offsetWidth;
      el.resultsPanel.classList.add("question-animating");
    }
    renderResultsPanel();
    return;
  }

  if (el.questionContainer) {
    el.questionContainer.hidden = false;
    el.questionContainer.classList.remove("question-animating");
    void el.questionContainer.offsetWidth;
    el.questionContainer.classList.add("question-animating");
  }
  if (el.resultsPanel) el.resultsPanel.hidden = true;

  const question = currentQuestion();
  if (!question) return;

  el.questionCounter.textContent = `Question ${state.current + 1} of ${state.order.length}`;
  el.typeBadge.textContent = question.type === "matching"
    ? "Matching"
    : question.chooseCount > 1
      ? `Choose ${question.chooseCount}`
      : "Single choice";
  el.questionText.textContent = question.prompt;

  el.imageStrip.innerHTML = "";
  question.images.forEach((src) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "Question exhibit";
    image.loading = "lazy";
    image.title = "Click to view full size";
    image.addEventListener("click", () => openImageModal(src));
    el.imageStrip.append(image);
  });

  renderMatching(question);
  renderChoices(question);
  renderExplanation(question);

  el.prevButton.disabled = state.current === 0;
  el.nextButton.disabled = false;
  if (el.holdAnswerButton) el.holdAnswerButton.disabled = false;
}

function renderResultsPanel() {
  const total = state.questions.length;
  const answered = state.questions.filter((q) => q.checked).length;
  const correct = state.questions.filter((q) => q.correct).length;
  const wrong = answered - correct;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (el.finalScoreVal) el.finalScoreVal.textContent = `${correct} / ${total}`;
  if (el.finalPercentVal) el.finalPercentVal.textContent = `${percent}%`;
  if (el.correctCountVal) el.correctCountVal.textContent = `${correct}`;
  if (el.wrongCountVal) el.wrongCountVal.textContent = `${wrong}`;

  if (el.resultsBadge) {
    const isPassed = percent >= 70;
    el.resultsBadge.textContent = isPassed ? "PASSED (70%+)" : "NEEDS PRACTICE";
    el.resultsBadge.className = `results-badge ${isPassed ? "pass" : "fail"}`;
  }

  if (el.resultsSubtitle) {
    el.resultsSubtitle.textContent = `Completed ${answered} of ${total} questions. You scored ${percent}%.`;
  }

  if (el.breakdownList) {
    el.breakdownList.innerHTML = "";

    const types = [
      { key: "single", label: "Single Choice" },
      { key: "multi", label: "Multiple Choice" },
      { key: "matching", label: "Matching & Ordering" }
    ];

    types.forEach(({ key, label }) => {
      const typeQuestions = state.questions.filter((q) => {
        if (key === "matching") return q.type === "matching";
        if (key === "multi") return q.chooseCount > 1 && q.type !== "matching";
        return (q.chooseCount || 1) === 1 && q.type !== "matching";
      });

      if (!typeQuestions.length) return;

      const tTotal = typeQuestions.length;
      const tCorrect = typeQuestions.filter((q) => q.correct).length;
      const tPercent = Math.round((tCorrect / tTotal) * 100);

      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `
        <div class="breakdown-label">
          <span>${label}</span>
          <strong>${tCorrect} / ${tTotal} (${tPercent}%)</strong>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${tPercent}%"></div>
        </div>
      `;
      el.breakdownList.append(row);
    });
  }
}

function renderStats() {
  const answered = state.questions.filter((question) => question.checked).length;
  const score = state.questions.filter((question) => question.correct).length;
  el.scoreValue.textContent = score;
  el.answeredValue.textContent = answered;
  el.totalValue.textContent = state.questions.length;
}

function renderQuestionList() {
  el.questionList.innerHTML = "";
  let activeDot = null;
  state.order.forEach((questionIndex, displayIndex) => {
    const question = state.questions[questionIndex];
    const button = document.createElement("button");
    button.className = "question-dot";
    if (!state.showResults && displayIndex === state.current) {
      button.classList.add("current");
      activeDot = button;
    }
    if (question.checked) button.classList.add(question.correct ? "correct" : "wrong");
    button.textContent = String(displayIndex + 1);
    button.type = "button";
    button.addEventListener("click", () => {
      state.showResults = false;
      state.current = displayIndex;
      render();
    });
    el.questionList.append(button);
  });

  const resultsBtn = document.createElement("button");
  resultsBtn.className = "question-dot results-dot";
  resultsBtn.textContent = "★ Results";
  resultsBtn.title = "View performance summary & analytics";
  if (state.showResults) {
    resultsBtn.classList.add("current");
    activeDot = resultsBtn;
  }
  resultsBtn.addEventListener("click", () => {
    state.current = state.order.length;
    state.showResults = true;
    render();
  });
  el.questionList.append(resultsBtn);

  if (activeDot) {
    requestAnimationFrame(() => {
      activeDot.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }
}

function renderChoices(question) {
  el.choicesForm.innerHTML = "";
  if (question.type === "matching") {
    el.choicesForm.hidden = true;
    return;
  }
  el.choicesForm.hidden = false;

  if (!question.choices.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No multiple-choice answers were detected for this item.";
    el.choicesForm.append(empty);
    return;
  }

  question.choices.forEach((choice, index) => {
    const fragment = el.choiceTemplate.content.cloneNode(true);
    const label = fragment.querySelector(".choice");
    const input = fragment.querySelector("input");
    const text = fragment.querySelector("span");
    input.type = question.chooseCount > 1 ? "checkbox" : "radio";
    input.value = String(index);
    input.checked = question.selected.includes(index);
    input.disabled = state.reviewMode || question.checked;
    text.textContent = choice.text;

    input.addEventListener("change", () => {
      if (input.type === "radio") {
        question.selected = [index];
        checkCurrent();
      } else if (input.checked) {
        question.selected = [...new Set([...question.selected, index])];
        if (question.selected.length === question.chooseCount) {
          checkCurrent();
        } else {
          render();
        }
      } else {
        question.selected = question.selected.filter((selected) => selected !== index);
        render();
      }
    });

    if (question.checked || state.reviewMode || state.peeking) {
      const selected = question.selected.includes(index);
      if (choice.correct) {
        label.classList.add(selected || state.reviewMode || state.peeking ? "correct" : "missed");
      }
      if (selected && !choice.correct && !state.peeking) {
        label.classList.add("wrong");
      }
    }

    el.choicesForm.append(fragment);
  });
}

function renderMatching(question) {
  el.matchingPanel.innerHTML = "";
  if (question.type !== "matching" || !question.matchingData?.targets?.length) {
    el.matchingPanel.hidden = true;
    return;
  }

  el.matchingPanel.hidden = false;

  const header = document.createElement("div");
  header.className = "matching-header";
  header.innerHTML = `
    <h3>Matching / Ordering</h3>
    <p class="matching-hint">Drag items into target slots, or tap an item then tap a slot to place it.</p>
  `;

  // Source Items Pool
  const poolSection = document.createElement("div");
  poolSection.className = "matching-pool-section";
  const poolTitle = document.createElement("h4");
  poolTitle.textContent = "Available Items:";
  const poolContainer = document.createElement("div");
  poolContainer.className = "matching-pool";

  const assignedSourceIds = new Set(Object.values(question.userMatches || {}).map(String));

  question.matchingData.sources.forEach((source) => {
    const chip = document.createElement("div");
    chip.className = "matching-chip";
    chip.textContent = source.text;
    chip.setAttribute("data-source-id", String(source.id));

    const isAssigned = assignedSourceIds.has(String(source.id));
    const isSelected = question.selectedSourceId !== null && question.selectedSourceId !== undefined && String(question.selectedSourceId) === String(source.id);

    if (isAssigned) {
      chip.classList.add("placed");
    } else {
      chip.setAttribute("draggable", "true");
      if (isSelected) chip.classList.add("selected");

      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(source.id));
        e.dataTransfer.effectAllowed = "move";
        chip.classList.add("dragging");
      });

      chip.addEventListener("dragend", () => {
        chip.classList.remove("dragging");
      });

      chip.addEventListener("click", () => {
        if (state.reviewMode || question.checked || state.peeking) return;
        if (String(question.selectedSourceId) === String(source.id)) {
          question.selectedSourceId = null;
        } else {
          question.selectedSourceId = source.id;
        }
        renderMatching(question);
      });
    }

    poolContainer.append(chip);
  });

  poolSection.append(poolTitle, poolContainer);

  // Targets Slots Grid
  const targetsSection = document.createElement("div");
  targetsSection.className = "matching-targets-section";
  const targetsTitle = document.createElement("h4");
  targetsTitle.textContent = "Target Slots:";
  const targetsGrid = document.createElement("div");
  targetsGrid.className = "matching-targets";

  question.matchingData.targets.forEach((target) => {
    const slotCard = document.createElement("div");
    slotCard.className = "matching-slot-card";

    const label = document.createElement("div");
    label.className = "matching-slot-label";
    label.textContent = target.text;

    const dropzone = document.createElement("div");
    dropzone.className = "matching-dropzone";
    dropzone.setAttribute("data-target-id", String(target.id));

    const assignedSourceId = (question.userMatches || {})[target.id] ?? (question.userMatches || {})[String(target.id)];

    if (state.reviewMode || state.peeking) {
      // In review mode or peeking mode, show the correct source placement
      const correctSource = question.matchingData.sources.find((s) => target.correctSourceIds.map(String).includes(String(s.id)));
      if (correctSource) {
        const correctEl = document.createElement("div");
        correctEl.className = "slotted-item correct-slot";
        correctEl.textContent = correctSource.text;
        dropzone.append(correctEl);
        slotCard.classList.add("correct");
      } else {
        const emptySpan = document.createElement("span");
        emptySpan.className = "dropzone-empty";
        emptySpan.textContent = "Unassigned";
        dropzone.append(emptySpan);
      }
    } else if (assignedSourceId !== undefined && assignedSourceId !== null) {
      const assignedSource = question.matchingData.sources.find((s) => String(s.id) === String(assignedSourceId));
      if (assignedSource) {
        const itemEl = document.createElement("div");
        itemEl.className = "slotted-item";
        itemEl.textContent = assignedSource.text;

        if (!question.checked) {
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "unslot-btn";
          removeBtn.title = "Remove item";
          removeBtn.innerHTML = "&times;";
          removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            delete question.userMatches[target.id];
            delete question.userMatches[String(target.id)];
            render();
          });
          itemEl.append(removeBtn);
        }

        dropzone.append(itemEl);
      }
    } else {
      const emptySpan = document.createElement("span");
      emptySpan.className = "dropzone-empty";
      emptySpan.textContent = question.selectedSourceId !== null && question.selectedSourceId !== undefined
        ? "Tap here to place selected item"
        : "Drop item here (or tap item first)";
      dropzone.append(emptySpan);
    }

    // Drag & Drop handlers on dropzone
    if (!state.reviewMode && !question.checked && !state.peeking) {
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        dropzone.classList.add("drag-over");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("drag-over");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");
        const rawSourceId = e.dataTransfer.getData("text/plain");
        const sourceObj = question.matchingData.sources.find((s) => String(s.id) === String(rawSourceId)) || question.matchingData.sources[Number(rawSourceId)];
        if (sourceObj) {
          assignSourceToTarget(question, sourceObj.id, target.id);
        }
      });

      dropzone.addEventListener("click", () => {
        if (question.selectedSourceId !== null && question.selectedSourceId !== undefined) {
          assignSourceToTarget(question, question.selectedSourceId, target.id);
        }
      });
    }

    // Checking feedback
    if (question.checked && !state.reviewMode && !state.peeking) {
      const isTargetCorrect = assignedSourceId !== undefined && assignedSourceId !== null && target.correctSourceIds.map(String).includes(String(assignedSourceId));
      slotCard.classList.add(isTargetCorrect ? "correct" : "wrong");

      if (!isTargetCorrect) {
        const correctSource = question.matchingData.sources.find((s) => target.correctSourceIds.map(String).includes(String(s.id)));
        if (correctSource) {
          const hint = document.createElement("div");
          hint.className = "correct-answer-hint";
          hint.textContent = `Correct: ${correctSource.text}`;
          slotCard.append(hint);
        }
      }
    }

    slotCard.append(label, dropzone);
    targetsGrid.append(slotCard);
  });

  targetsSection.append(targetsTitle, targetsGrid);
  el.matchingPanel.append(header, poolSection, targetsSection);
}

function assignSourceToTarget(question, sourceId, targetId) {
  if (!question.userMatches) question.userMatches = {};
  // If source was assigned to another target, unassign it
  Object.keys(question.userMatches).forEach((tId) => {
    if (String(question.userMatches[tId]) === String(sourceId)) {
      delete question.userMatches[tId];
    }
  });

  question.userMatches[targetId] = sourceId;
  question.selectedSourceId = null;

  const targetCount = question.matchingData?.targets?.length || 0;
  const assignedCount = Object.keys(question.userMatches).length;

  if (targetCount > 0 && assignedCount === targetCount) {
    checkCurrent();
  } else {
    render();
  }
}

function renderExplanation(question) {
  const shouldShow = state.reviewMode || question.checked || state.peeking;
  el.explanationPanel.hidden = !shouldShow;
  if (el.explanationPlaceholder) {
    el.explanationPlaceholder.hidden = shouldShow;
  }
  if (!shouldShow) return;

  if (question.type === "matching" && question.matchingData?.targets?.length) {
    const pairs = question.matchingData.targets.map((t) => {
      const correctSourceNames = t.correctSourceIds
        .map((sId) => question.matchingData.sources.find((s) => s.id === sId)?.text)
        .filter(Boolean);
      return `${t.text} → ${correctSourceNames.join(" OR ")}`;
    });

    el.answerLine.textContent = pairs.length
      ? `Matching Answer Key:\n• ${pairs.join("\n• ")}`
      : "Answer key unavailable.";
    el.explanationText.textContent = question.explanation || "No additional explanation detected.";
    return;
  }

  const correctAnswers = question.choices.filter((choice) => choice.correct).map((choice) => choice.text);
  el.answerLine.textContent = correctAnswers.length
    ? `Answer: ${correctAnswers.join(" | ")}`
    : "Answer key was not detected for this question.";
  el.explanationText.textContent = question.explanation || "No explanation was detected.";
}

function checkCurrent() {
  const question = currentQuestion();
  if (!question) return;

  if (question.type === "matching") {
    const userMatches = question.userMatches || {};
    const hasAssignments = Object.keys(userMatches).length > 0;
    if (!hasAssignments) return;

    const targets = question.matchingData?.targets || [];
    const allCorrect = targets.every((target) => {
      const assignedId = userMatches[target.id] ?? userMatches[String(target.id)];
      if (assignedId === undefined || assignedId === null) return false;
      return (target.correctSourceIds || []).map(String).includes(String(assignedId));
    });

    question.checked = true;
    question.correct = allCorrect;
    render();
    return;
  }

  if (!question.selected.length) {
    return;
  }

  const selectedCorrect = question.selected.every((index) => question.choices[index]?.correct);
  const allCorrectSelected = question.choices.every((choice, index) => !choice.correct || question.selected.includes(index));
  question.checked = true;
  question.correct = selectedCorrect && allCorrectSelected;
  render();
}

function currentQuestion() {
  return state.questions[state.order[state.current]];
}

function shuffleOrder() {
  state.order = shuffle(state.questions.map((_, index) => index));
}

function htmlToDocument(html) {
  return new DOMParser().parseFromString(html, "text/html");
}

function textToDocument(text) {
  const doc = window.document.implementation?.createHTMLDocument
    ? window.document.implementation.createHTMLDocument("")
    : htmlToDocument("<body></body>");
  const pre = doc.createElement("pre");
  pre.textContent = text;
  doc.body.append(pre);
  return doc;
}

function normalizeImages(root, baseUrl) {
  root.querySelectorAll("img").forEach((image) => {
    const raw = image.getAttribute("src") || image.getAttribute("data-src") || image.getAttribute("data-lazy-src");
    if (!raw) return;
    try {
      image.src = new URL(raw, baseUrl).href;
    } catch {
      image.src = raw;
    }
  });
}

function extractImages(node) {
  return [...node.querySelectorAll("img")]
    .map((image) => image.currentSrc || image.src || image.getAttribute("src") || image.getAttribute("data-src") || image.getAttribute("data-lazy-src"))
    .filter(Boolean);
}

function extractImagesFromNodes(nodes) {
  return nodes.flatMap((node) => extractImages(node));
}

function mapImagesNearQuestions(root, baseUrl) {
  const map = new Map();
  const html = root.innerHTML || "";
  const imagePattern = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
  const questionPattern = /(?:^|>|\n)\s*(\d+)\.\s*(?:Question\b|[A-Z0-9"“])/g;
  const markers = [];
  let questionMatch;
  while ((questionMatch = questionPattern.exec(html))) {
    markers.push({ number: Number(questionMatch[1]), index: questionMatch.index });
  }

  let imageMatch;
  while ((imageMatch = imagePattern.exec(html))) {
    const prior = markers.filter((marker) => marker.index < imageMatch.index).pop();
    if (!prior) continue;
    let src = imageMatch[1];
    try {
      src = new URL(src, baseUrl).href;
    } catch {}
    if (!map.has(prior.number)) map.set(prior.number, []);
    map.get(prior.number).push(src);
  }
  return map;
}

function extractExplanation(text) {
  const match = text.match(/Explanation\s*:?\s*([\s\S]+)/i);
  return match ? clean(match[1]) : "";
}

function dedupeQuestions(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = fingerprint(question.prompt);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanupPrompt(text) {
  return clean(text)
    .replace(/^\d+\.\s*/, "")
    .replace(/^Question\s*/i, "")
    .replace(/^\d+\s*points?\s*/i, "")
    .replace(/\s+Image\s*$/i, "")
    .trim();
}

function cleanLines(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function clean(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fingerprint(text) {
  return clean(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function wordToNumber(value) {
  const map = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  return Number(value) || map[value.toLowerCase()] || 1;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setBusy(isBusy) {
  el.loadUrlButton.disabled = isBusy;
  el.loadPasteButton.disabled = isBusy;
}

function setStatus(message, isError = false) {
  el.importStatus.textContent = message;
  el.importStatus.style.color = isError ? "var(--bad)" : "var(--muted)";
}

function initTheme() {
  const saved = localStorage.getItem("itexam-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  el.themeToggle.checked = isDark;
  localStorage.setItem("itexam-theme", isDark ? "dark" : "light");
}
