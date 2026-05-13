// ceangal — DOM text overlay for accessibility and text selection
//
// Creates transparent HTML elements over a canvas to enable:
// - Text selection and copy
// - Screen reader access (semantic HTML + ARIA)
// - IME text input

// Text line definition — mirrors renderer text positions
// role: "heading" (h1-h6), "label" (note with aria-label), or default (span)
//
// Usage:
//   const lines = [
//     { text: "Title", size: 40, x: 0.0, y: 0.64, align: "center", role: "heading", level: 1 },
//     ...
//   ];
//   createTextOverlay(overlayEl, canvas, lines);

export function createTextOverlay(overlay, canvas, lines) {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;

  const ndcToX = (nx) => (nx + 1) * 0.5 * W;
  const ndcToY = (ny) => (1 - ny) * 0.5 * H;

  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "ceangal UI rendered via snaidhm GPU path renderer");

  overlay.setAttribute("role", "document");
  overlay.setAttribute("aria-label", "UI text content");

  for (const line of lines) {
    let el;
    if (line.role === "heading" && line.level) {
      const tag = `h${Math.min(line.level, 6)}`;
      el = document.createElement(tag);
      el.style.margin = "0";
      el.style.fontWeight = "normal";
    } else {
      el = document.createElement("span");
    }

    el.textContent = line.text;
    el.style.fontSize = line.size + "px";
    el.style.fontFamily = "sans-serif";

    if (line.role === "label") {
      el.setAttribute("role", "note");
      el.setAttribute("aria-label", `${line.text} — ${line.labelFor} label`);
    }

    overlay.appendChild(el);

    const elW = el.offsetWidth;
    const baselinePx = ndcToY(line.y);
    const topPx = baselinePx - line.size * 0.75;

    let leftPx;
    if (line.align === "center") {
      leftPx = ndcToX(line.x) - elW / 2;
    } else {
      leftPx = ndcToX(line.x);
    }

    el.style.left = leftPx + "px";
    el.style.top = topPx + "px";
  }
}
