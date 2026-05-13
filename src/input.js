// ceangal — Text input with IME support
//
// Uses a real <textarea> overlaid on the input area.
// The textarea is the source of truth for text content.
// During IME composition, the browser natively displays intermediate text.
// On blur, committed text is shown in a display div.
//
// Usage:
//   setupTextInput(overlayEl, textareaEl, canvas, {
//     ndcX: 0.29, ndcY: -0.48, ndcWidth: 0.52,
//     fontSize: 11, placeholder: "Type here...",
//   });

export function setupTextInput(overlay, textarea, canvas, opts = {}) {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  const ndcToX = (nx) => (nx + 1) * 0.5 * W;
  const ndcToY = (ny) => (1 - ny) * 0.5 * H;

  const {
    ndcX = 0.29,
    ndcY = -0.48,
    ndcWidth = 0.52,
    fontSize = 11,
    placeholder = "Type here...",
  } = opts;

  const left = ndcToX(ndcX);
  const top = ndcToY(ndcY);
  const width = ndcToX(ndcX + ndcWidth) - left;

  // Visual container
  const inputArea = document.createElement("div");
  inputArea.className = "input-area";
  inputArea.setAttribute("role", "textbox");
  inputArea.setAttribute("aria-label", "Text input field");
  inputArea.style.left = left + "px";
  inputArea.style.top = top + "px";
  inputArea.style.width = width + "px";
  inputArea.style.fontSize = fontSize + "px";
  inputArea.style.fontFamily = "sans-serif";

  const display = document.createElement("div");
  display.className = "input-display";
  inputArea.appendChild(display);

  overlay.appendChild(inputArea);

  // Position textarea over input area
  textarea.style.left = left + "px";
  textarea.style.top = top + "px";
  textarea.style.width = width + "px";
  textarea.style.height = "1.4em";
  textarea.style.fontSize = fontSize + "px";

  let focused = false;

  function renderPlaceholder() {
    display.innerHTML = "";
    if (!focused && textarea.value === "") {
      const ph = document.createElement("span");
      ph.className = "placeholder";
      ph.textContent = placeholder;
      display.appendChild(ph);
    }
  }

  inputArea.addEventListener("click", () => {
    textarea.style.pointerEvents = "auto";
    textarea.focus();
  });

  textarea.addEventListener("focus", () => {
    focused = true;
    textarea.style.color = "#333";
    textarea.style.caretColor = "#333";
    inputArea.style.outline = "1.5px solid rgba(66, 133, 244, 0.6)";
    inputArea.style.outlineOffset = "2px";
    inputArea.style.borderRadius = "2px";
    renderPlaceholder();
  });

  textarea.addEventListener("blur", () => {
    focused = false;
    textarea.style.color = "transparent";
    textarea.style.caretColor = "transparent";
    textarea.style.pointerEvents = "none";
    inputArea.style.outline = "none";
    display.innerHTML = "";
    if (textarea.value) {
      display.appendChild(document.createTextNode(textarea.value));
    } else {
      renderPlaceholder();
    }
  });

  textarea.addEventListener("input", () => {
    renderPlaceholder();
  });

  renderPlaceholder();

  return {
    get value() { return textarea.value; },
    set value(v) { textarea.value = v; renderPlaceholder(); },
    focus() { inputArea.click(); },
  };
}
