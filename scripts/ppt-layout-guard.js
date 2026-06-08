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
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function unitNumber(value) {
  if (!value) return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
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
  const re = /<section\b([^>]*)class=["'][^"']*\bslide\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = re.exec(source))) {
    const attrs = match[1] || "";
    const startAttrs = source.slice(match.index, source.indexOf(">", match.index) + 1);
    slides.push({
      page: getAttr(startAttrs, "data-page") || String(slides.length + 1).padStart(2, "0"),
      html: match[2],
      start: match.index,
    });
  }
  return slides;
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

for (const slide of slides) {
  const zones = extractZones(slide);
  allZones.push(...zones);
  const major = zones.filter((z) => /title|body|card|visual|footer|nav/.test(z.role));
  if (major.length > 1 && !hasBudget) {
    issues.push(issue(
      "P0",
      "missing_layout_box_budget",
      slide.page,
      "multi-element slide has data zones but no layout_box_budget source contract"
    ));
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
    "title required height and visual-effect padding",
    "title/body/card vertical clearance",
    "navigation safe-zone clearance",
    "unsafe tight line-height",
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
