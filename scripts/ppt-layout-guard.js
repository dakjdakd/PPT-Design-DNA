#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const STAGE = { w: 1920, h: 1080 };
const NAV_SAFE_TOP = 940;
const REQUIRED_GAP = {
  titleToContent: 56,
  bodyToCard: 40,
  cardToNav: 88,
  eyebrowToTitle: 18,
  titleToSubtitle: 44,
  titleToLead: 44,
  textToText: 24,
};

function usage() {
  console.error("Usage: node scripts/ppt-layout-guard.js <deck.html> [--json] [--report <path>]");
}

function argValue(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith("--"));
if (!input) {
  usage();
  process.exit(2);
}

const jsonOnly = args.includes("--json");
const reportPath = argValue(args, "--report");
const htmlPath = path.resolve(input);
let html = "";
try {
  html = fs.readFileSync(htmlPath, "utf8");
} catch (err) {
  console.error(`Cannot read ${htmlPath}: ${err.message}`);
  process.exit(2);
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttr(attrs, name) {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = attrs.match(re);
  return match ? match[1] : "";
}

function parseStyle(style = "") {
  const out = {};
  for (const part of style.split(";")) {
    const idx = part.indexOf(":");
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (key) out[key] = val;
  }
  return out;
}

function px(value) {
  if (!value) return null;
  const match = String(value).match(/-?(?:\d+(?:\.\d+)?|\.\d+)/);
  return match ? Number(match[0]) : null;
}

function unitNumber(value) {
  if (!value) return null;
  const match = String(value).match(/-?(?:\d+(?:\.\d+)?|\.\d+)/);
  return match ? Number(match[0]) : null;
}

function parseClassRules(source) {
  const rules = new Map();
  const styleBlocks = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  for (const css of styleBlocks) {
    const re = /([^{}]+)\{([^{}]+)\}/g;
    let match;
    while ((match = re.exec(css))) {
      const selectors = match[1].split(",").map((s) => s.trim());
      const body = parseStyle(match[2]);
      for (const selector of selectors) {
        const classMatches = [...selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
        if (classMatches.length === 1 && selector.startsWith(".")) {
          const cls = classMatches[0];
          rules.set(cls, Object.assign(rules.get(cls) || {}, body));
        }
      }
    }
  }
  return rules;
}

const classRules = parseClassRules(html);
const cssRules = [];
for (const css of [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1])) {
  const re = /([^{}]+)\{([^{}]+)\}/g;
  let match;
  while ((match = re.exec(css))) {
    cssRules.push({ selector: match[1].trim(), style: parseStyle(match[2]) });
  }
}

function styleForClasses(className) {
  const merged = {};
  for (const cls of className.split(/\s+/).filter(Boolean)) {
    Object.assign(merged, classRules.get(cls) || {});
  }
  return merged;
}

function mergeElementStyle(attrs) {
  const className = getAttr(attrs, "class");
  return Object.assign(styleForClasses(className), parseStyle(getAttr(attrs, "style")));
}

function hasCjk(text) {
  return /[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text);
}

function cjkCharCount(text) {
  return ([...text].filter((ch) => /[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(ch))).length;
}

function visibleCharCount(text) {
  return [...String(text || "").replace(/\s+/g, "")].length;
}

function hasDescender(text) {
  return /[gypqj]/i.test(text);
}

function estimateLines(text, width, fontSize, explicitBreaks) {
  if (!text) return Math.max(1, explicitBreaks || 1);
  const cleaned = text.replace(/\s+/g, " ").trim();
  const cjk = hasCjk(cleaned);
  const chars = [...cleaned].length;
  const perLine = Math.max(4, Math.floor(width / (fontSize * (cjk ? 0.95 : 0.54))));
  return Math.max(explicitBreaks || 1, Math.ceil(chars / perLine));
}

function estimatedLineRemainder(text, width, fontSize) {
  const cleaned = String(text || "").replace(/\s+/g, "").trim();
  if (!cleaned || !width || !fontSize) return null;
  const chars = visibleCharCount(cleaned);
  const cjk = hasCjk(cleaned);
  const perLine = Math.max(4, Math.floor(width / (fontSize * (cjk ? 0.95 : 0.54))));
  if (chars <= perLine) return { lines: 1, remainder: chars, perLine };
  const remainder = chars % perLine || perLine;
  return { lines: Math.ceil(chars / perLine), remainder, perLine };
}

function textMetricsFromInner(inner, zone) {
  const headingMatch = inner.match(/<(h1|h2|h3)([^>]*)>([\s\S]*?)<\/\1>/i);
  const target = headingMatch || inner.match(/<(p|div)([^>]*)>([\s\S]*?)<\/\1>/i);
  if (!target) {
    return {
      text: stripTags(inner),
      fontSize: zone.role === "title" ? 80 : 30,
      lineHeight: zone.role === "title" ? 1.12 : 1.35,
      marginTop: 0,
      explicitLines: 1,
      classes: "",
    };
  }
  const attrs = target[2] || "";
  const elementStyle = mergeElementStyle(attrs);
  const className = getAttr(attrs, "class");
  const text = stripTags(target[3] || "");
  const explicitLines = Math.max(1, (target[3].match(/<br\s*\/?>/gi) || []).length + 1);
  const fontSize = px(elementStyle["font-size"]) || (zone.role === "title" ? 80 : 30);
  let lineHeight = unitNumber(elementStyle["line-height"]);
  if (!lineHeight) lineHeight = zone.role === "title" ? 1.12 : 1.35;
  if (lineHeight > 6) lineHeight = lineHeight / fontSize;
  const marginTop = px(elementStyle["margin-top"]) || 0;
  return { text, fontSize, lineHeight, marginTop, explicitLines, classes: className };
}

function tagStackHeight(inner) {
  const tags = [...inner.matchAll(/<p([^>]*)class=["'][^"']*\btag\b[^"']*["'][^>]*>/gi)];
  if (!tags.length) return 0;
  return tags.length * 48;
}

function zoneVisualHeight(zone) {
  const metrics = textMetricsFromInner(zone.inner, zone);
  const lines = estimateLines(metrics.text, zone.w || 900, metrics.fontSize, metrics.explicitLines);
  const cjk = hasCjk(metrics.text);
  let glyphTop = zone.role === "title" ? Math.max(12, metrics.fontSize * 0.12) : 6;
  let glyphBottom = zone.role === "title" ? Math.max(18, metrics.fontSize * (cjk ? 0.24 : 0.18)) : 8;
  if (zone.role === "title" && hasDescender(metrics.text)) glyphBottom += Math.max(10, metrics.fontSize * 0.08);
  const className = `${zone.className} ${metrics.classes}`;
  const effectPad = /bubble|massive|stroke|pop|shadow|offset|comic|zh-title/.test(className)
    ? Math.max(24, metrics.fontSize * 0.22)
    : 0;
  const stack = tagStackHeight(zone.inner);
  const rawText = lines * metrics.fontSize * metrics.lineHeight;
  return {
    text: metrics.text,
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    estimatedLines: lines,
    glyphPadTop: Math.round(glyphTop),
    glyphPadBottom: Math.round(glyphBottom),
    visualEffectPad: Math.round(effectPad),
    requiredH: Math.ceil(stack + metrics.marginTop + rawText + glyphTop + glyphBottom + effectPad),
  };
}

function parsePosition(attrs, role) {
  const style = parseStyle(getAttr(attrs, "style"));
  const className = getAttr(attrs, "class");
  const x = px(style.left);
  const y = px(style.top);
  const w = px(style.width);
  const h = px(style.height) || px(style["min-height"]);
  const right = px(style.right);
  const bottom = px(style.bottom);
  return {
    role,
    className,
    x: x == null && right != null && w != null ? STAGE.w - right - w : x,
    y: y == null && bottom != null && h != null ? STAGE.h - bottom - h : y,
    w: w == null && x != null && right != null ? STAGE.w - x - right : w,
    h,
    rawStyle: style,
  };
}

function rectsOverlap(a, b) {
  if ([a.x, a.y, a.w, a.requiredH, b.x, b.y, b.w].some((v) => v == null)) return false;
  const ah = a.requiredH || a.h || 0;
  const bh = b.requiredH || b.h || 0;
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + bh && a.y + ah > b.y;
}

function horizontalOverlap(a, b) {
  if ([a.x, a.w, b.x, b.w].some((v) => v == null)) return true;
  return a.x < b.x + b.w && a.x + a.w > b.x;
}

function extractSlides(source) {
  const slides = [];
  const re = /<(section|article|div)\b([^>]*)class=["'][^"']*\bslide\b[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(source))) {
    const attrs = match[2] || "";
    const startAttrs = source.slice(match.index, source.indexOf(">", match.index) + 1);
    slides.push({
      page: getAttr(startAttrs, "data-page") || String(slides.length + 1).padStart(2, "0"),
      html: match[3],
      start: match.index,
    });
  }
  return slides;
}

function classHas(attrs, names) {
  const className = getAttr(attrs, "class").toLowerCase();
  return names.some((name) => new RegExp(`(^|\\s)${name}(\\s|$)`).test(className));
}

function extractTextElements(slide) {
  const out = [];
  const re = /<(h1|h2|h3|p|div)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(slide.html))) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] || "";
    const className = getAttr(attrs, "class");
    const inner = match[3] || "";
    const text = stripTags(inner);
    if (!text) continue;
    const style = mergeElementStyle(attrs);
    const role = tag === "h1" || tag === "h2" || tag === "h3" || classHas(attrs, ["title", "headline", "mega", "huge"])
      ? "title"
      : classHas(attrs, ["subtitle", "lead", "copy"])
        ? "lead"
        : classHas(attrs, ["kicker", "eyebrow"])
          ? "eyebrow"
          : "text";
    const fontSize = px(style["font-size"]) || (role === "title" ? 80 : role === "lead" ? 34 : 26);
    let lineHeight = unitNumber(style["line-height"]);
    if (!lineHeight) lineHeight = role === "title" ? 1.1 : 1.35;
    if (lineHeight > 6) lineHeight = lineHeight / fontSize;
    const explicitLines = inner
      .split(/<br\s*\/?>/i)
      .map(stripTags)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    out.push({ tag, className, role, text, inner, fontSize, lineHeight, explicitLines });
  }
  return out;
}

function lineHasCjkOrMixed(text) {
  return hasCjk(text) || (/[a-z0-9]/i.test(text) && /[\u3400-\u9fff]/.test(text));
}

function looksLikeDisplayElement(el) {
  return el.role === "title" || /\b(title|headline|mega|huge|display|poster|bubble-word)\b/i.test(el.className);
}

function extractZones(slide) {
  const starts = [];
  const re = /<([a-z0-9-]+)\b([^>]*\bdata-zone\s*=\s*["']([^"']+)["'][^>]*)>/gi;
  let match;
  while ((match = re.exec(slide.html))) {
    starts.push({
      tag: match[1],
      attrs: match[2],
      role: match[3],
      index: match.index,
      endStartTag: re.lastIndex,
    });
  }
  return starts.map((start, i) => {
    const next = starts[i + 1] ? starts[i + 1].index : slide.html.length;
    const inner = slide.html.slice(start.endStartTag, next);
    const pos = parsePosition(start.attrs, start.role);
    const metrics = zoneVisualHeight(Object.assign({}, pos, { inner, role: start.role }));
    return Object.assign(pos, metrics, {
      id: `${slide.page}:${start.role}:${i + 1}`,
      page: slide.page,
      inner,
      bottom: pos.y == null ? null : pos.y + metrics.requiredH,
    });
  });
}

function issue(severity, code, slide, message, extra = {}) {
  return Object.assign({ severity, code, slide, message }, extra);
}

const issues = [];
const hasBudget = /layout_box_budget/.test(html);
const slides = extractSlides(html);
const allZones = [];

if (!slides.length) {
  issues.push(issue(
    "P0",
    "no_slides_detected",
    "global",
    "no slide elements detected; use <section|article class=\"slide\"> so the static layout guard can inspect the deck"
  ));
}

for (const slide of slides) {
  const zones = extractZones(slide);
  const textElements = extractTextElements(slide);
  allZones.push(...zones);
  const major = zones.filter((z) => /title|body|card|visual|footer|nav/.test(z.role));
  if (textElements.length > 1 && !zones.length) {
    issues.push(issue(
      "P0",
      "missing_data_zones",
      slide.page,
      "slide has multiple text elements but no data-zone markers; source-level layout guard cannot verify text spacing or collisions"
    ));
  }

  if ((major.length > 1 || textElements.length > 1) && !hasBudget) {
    issues.push(issue(
      "P0",
      "missing_layout_box_budget",
      slide.page,
      "multi-element slide has text/zones but no layout_box_budget source contract"
    ));
  }

  for (const el of textElements) {
    if (!looksLikeDisplayElement(el)) continue;
    if (lineHasCjkOrMixed(el.text) && el.lineHeight < 1.02) {
      issues.push(issue(
        "P0",
        "unsafe_cjk_display_line_height",
        slide.page,
        `CJK/mixed display text line-height ${el.lineHeight} is below 1.02`,
        { text: el.text.slice(0, 80), class_name: el.className, font_size: el.fontSize }
      ));
    }
    for (const line of el.explicitLines) {
      const chars = visibleCharCount(line);
      const cjkChars = cjkCharCount(line);
      if (lineHasCjkOrMixed(line) && chars > 0 && chars <= 2 && el.explicitLines.length > 1) {
        issues.push(issue(
          "P0",
          "cjk_orphan_line",
          slide.page,
          `display title has an orphan short line "${line}"`,
          {
            text: el.text.slice(0, 100),
            line,
            fix: [
              "rewrite or manually split the title into balanced semantic lines",
              "reduce title font size by 5-12%",
              "increase title width or switch to a different composition",
            ],
          }
        ));
      }
      if (lineHasCjkOrMixed(line) && cjkChars > 0 && cjkChars <= 2 && chars <= 4 && el.explicitLines.length > 1) {
        issues.push(issue(
          "P0",
          "ugly_cjk_short_title_line",
          slide.page,
          `display title line "${line}" is too short for a CJK/mixed headline`,
          { text: el.text.slice(0, 100), line }
        ));
      }
    }
  }

  const titles = zones.filter((z) => z.role === "title");
  const content = zones.filter((z) => /body|card|footer|visual/.test(z.role));
  for (const title of titles) {
    if (title.lineHeight < 1.06 && title.estimatedLines > 1) {
      issues.push(issue(
        "P0",
        "unsafe_display_line_height",
        slide.page,
        `multi-line title line-height ${title.lineHeight} is below 1.06`,
        { zone: title.id, font_size: title.fontSize, estimated_lines: title.estimatedLines }
      ));
    }
    const remainder = estimatedLineRemainder(title.text, title.w, title.fontSize);
    if (lineHasCjkOrMixed(title.text) && remainder && remainder.lines > 1 && remainder.remainder <= 2) {
      issues.push(issue(
        "P0",
        "estimated_cjk_orphan_line",
        slide.page,
        `title width/font estimate leaves ${remainder.remainder} visible character(s) on the final line`,
        {
          zone: title.id,
          text: title.text.slice(0, 100),
          estimated_lines: remainder.lines,
          estimated_chars_per_line: remainder.perLine,
          final_line_chars: remainder.remainder,
          fix: [
            "rewrite or manually split the title into balanced semantic lines",
            "reduce title font size by 5-12%",
            "increase title width or switch to a different composition",
          ],
        }
      ));
    }
    for (const other of content) {
      if (other.y == null || title.y == null || !horizontalOverlap(title, other)) continue;
      const minGap = other.role === "card" || other.role === "visual" ? REQUIRED_GAP.titleToContent : 44;
      const requiredTop = title.bottom + minGap;
      if (other.y < requiredTop) {
        issues.push(issue(
          "P0",
          "title_zone_collision",
          slide.page,
          `${other.role} starts at ${Math.round(other.y)} but title visual bottom plus gap requires >= ${Math.round(requiredTop)}`,
          {
            title_zone: title.id,
            next_zone: other.id,
            title_visual_bottom: Math.round(title.bottom),
            next_top: Math.round(other.y),
            required_next_top: Math.round(requiredTop),
            fix: [
              `move ${other.role} top to >= ${Math.round(requiredTop)}`,
              "reduce title font size by 5-12%",
              "shorten title or split the slide",
            ],
          }
        ));
      }
    }
  }

  const textZones = zones
    .filter((z) => /title|body|card|footer|eyebrow|lead|subtitle/.test(z.role))
    .filter((z) => z.y != null && z.w != null);
  for (let i = 0; i < textZones.length; i += 1) {
    for (let j = i + 1; j < textZones.length; j += 1) {
      const a = textZones[i];
      const b = textZones[j];
      if (!horizontalOverlap(a, b)) continue;
      const upper = a.y <= b.y ? a : b;
      const lower = a.y <= b.y ? b : a;
      const gap = lower.y - upper.bottom;
      if (gap < 0) continue;
      let minGap = REQUIRED_GAP.textToText;
      if (/eyebrow|kicker/.test(upper.role) && lower.role === "title") minGap = REQUIRED_GAP.eyebrowToTitle;
      if (upper.role === "title" && /subtitle|lead|body/.test(lower.role)) minGap = REQUIRED_GAP.titleToSubtitle;
      if ((upper.role === "body" || upper.role === "lead") && lower.role === "card") minGap = REQUIRED_GAP.bodyToCard;
      if (gap < minGap) {
        issues.push(issue(
          "P0",
          "unsafe_text_block_gap",
          slide.page,
          `${lower.role} starts ${Math.round(gap)}px after ${upper.role}; required visible gap is >= ${minGap}px`,
          {
            upper_zone: upper.id,
            lower_zone: lower.id,
            visible_gap: Math.round(gap),
            required_gap: minGap,
          }
        ));
      }
    }
  }

  const bodies = zones.filter((z) => z.role === "body");
  const cards = zones.filter((z) => z.role === "card");
  for (const body of bodies) {
    for (const card of cards) {
      if (card.y == null || body.y == null || !horizontalOverlap(body, card)) continue;
      const requiredTop = body.bottom + REQUIRED_GAP.bodyToCard;
      if (card.y < requiredTop) {
        issues.push(issue(
          "P0",
          "body_card_collision",
          slide.page,
          `card starts at ${Math.round(card.y)} but body visual bottom plus gap requires >= ${Math.round(requiredTop)}`,
          {
            body_zone: body.id,
            card_zone: card.id,
            body_visual_bottom: Math.round(body.bottom),
            card_top: Math.round(card.y),
            required_card_top: Math.round(requiredTop),
          }
        ));
      }
    }
  }

  for (const zone of zones.filter((z) => /card|body|footer/.test(z.role))) {
    if (zone.y == null) continue;
    const bottom = zone.bottom;
    if (bottom > NAV_SAFE_TOP - REQUIRED_GAP.cardToNav) {
      issues.push(issue(
        "P0",
        "nav_safe_zone_collision",
        slide.page,
        `${zone.role} visual bottom ${Math.round(bottom)} enters reserved navigation area`,
        { zone: zone.id, visual_bottom: Math.round(bottom), nav_safe_top: NAV_SAFE_TOP }
      ));
    }
  }
}

const lineHeightHazards = [...html.matchAll(/line-height\s*:\s*(\.\d+|0\.\d+|1(?:\.0+)?)/gi)];
for (const match of lineHeightHazards) {
  const value = Number(match[1]);
  if (value < 0.95) {
    issues.push(issue(
      "P0",
      "unsafe_tight_line_height",
      "global",
      `line-height ${value} is below 0.95 and can cause display text collision`
    ));
  }
}

for (const rule of cssRules) {
  const selector = rule.selector.toLowerCase();
  const isDisplaySelector = /title|headline|mega|huge|display|poster|bubble|zh|cjk/.test(selector);
  const lineHeight = unitNumber(rule.style["line-height"]);
  if (isDisplaySelector && lineHeight != null) {
    const normalizedLineHeight = lineHeight > 6 && px(rule.style["font-size"]) ? lineHeight / px(rule.style["font-size"]) : lineHeight;
    if (normalizedLineHeight < 1.02) {
      issues.push(issue(
        "P0",
        "unsafe_display_selector_line_height",
        "global",
        `display selector "${rule.selector}" uses line-height ${normalizedLineHeight}; CJK/mixed display text requires >= 1.02`
      ));
    }
  }
  const letterSpacing = rule.style["letter-spacing"];
  if (isDisplaySelector && letterSpacing && /^-\d/.test(letterSpacing)) {
    issues.push(issue(
      "P0",
      "negative_display_letter_spacing",
      "global",
      `display selector "${rule.selector}" uses negative letter-spacing, which is unsafe for CJK/mixed headlines`
    ));
  }
  const unsafeBreak = rule.style["word-break"] === "break-all" || rule.style["overflow-wrap"] === "anywhere";
  if (isDisplaySelector && unsafeBreak) {
    issues.push(issue(
      "P0",
      "unsafe_display_word_break",
      "global",
      `display selector "${rule.selector}" uses break-all/anywhere wrapping; plan headline lines manually instead`
    ));
  }
  const isStageCrop = /\b(html|body)\b|\.viewport|\.stage|\.slide\b/.test(selector);
  const isTextContainer = /\.content|\.card|\.lead|\.caption|\.label|title|body-note|chart-card/.test(selector);
  if (rule.style.overflow === "hidden" && isTextContainer && !isStageCrop) {
    issues.push(issue(
      "P0",
      "text_overflow_hidden",
      "global",
      `text/content selector "${rule.selector}" uses overflow:hidden, which can mask layout failure`
    ));
  }
}

const p0 = issues.filter((item) => item.severity === "P0").length;
const p1 = issues.filter((item) => item.severity === "P1").length;
const report = {
  status: p0 > 0 ? "fail" : "pass",
  file: htmlPath,
  summary: {
    slides: slides.length,
    zones: allZones.length,
    p0,
    p1,
  },
  issues,
  checked_rules: [
    "layout_box_budget presence",
    "slide and data-zone discoverability",
    "title required height and visual-effect padding",
    "title/body/card vertical clearance",
    "text block visible gap",
    "CJK/mixed headline orphan-line detection",
    "estimated CJK/mixed final-line orphan detection",
    "navigation safe-zone clearance",
    "unsafe tight line-height",
    "unsafe display selector line-height",
    "negative display letter-spacing",
    "unsafe display word-break",
    "text overflow hidden hazards",
  ],
};

if (reportPath) {
  fs.writeFileSync(path.resolve(reportPath), JSON.stringify(report, null, 2), "utf8");
}

if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else if (report.status === "pass") {
  console.log(`PASS ${path.basename(htmlPath)}: ${slides.length} slides, ${allZones.length} zones checked.`);
} else {
  console.log(`FAIL ${path.basename(htmlPath)}: ${p0} P0 issue(s), ${p1} P1 issue(s).`);
  for (const item of issues.slice(0, 20)) {
    console.log(`[${item.severity}] slide ${item.slide} ${item.code}: ${item.message}`);
  }
  if (issues.length > 20) console.log(`... ${issues.length - 20} more issue(s).`);
  if (reportPath) console.log(`Report: ${path.resolve(reportPath)}`);
}

process.exit(report.status === "pass" ? 0 : 1);
