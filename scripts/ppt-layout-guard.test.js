"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test, after } = require("node:test");

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-layout-guard-"));
const guard = path.join(__dirname, "ppt-layout-guard.js");
after(() => fs.rmSync(directory, { recursive: true, force: true }));

function check(name, content, budget = "") {
  const file = path.join(directory, name + ".html");
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"></head><body>
<section class="slide">${content}</section>${budget}</body></html>`);
  const result = spawnSync(process.execPath, [guard, file, "--json"], {
    encoding: "utf8", timeout: 10000, windowsHide: true,
  });
  assert.ifError(result.error);
  assert.equal(result.stderr, "");
  return { exit: result.status, ...JSON.parse(result.stdout) };
}

function expectMissing(result) {
  assert.equal(result.exit, 1);
  assert.equal(result.status, "fail");
  const codes = result.issues.map((item) => item.code);
  assert.ok(codes.includes("missing_data_zones"));
  assert.ok(codes.includes("missing_layout_box_budget"));
}

const text = "<h1>Example title</h1><p>Example body.</p>";
const marked = `<h1 data-zone="title" style="position:absolute;left:100px;top:100px;width:1200px;height:160px">Example title</h1>
<p data-zone="body" style="position:absolute;left:100px;top:400px;width:1200px;height:100px">Example body.</p>`;
const budget = '<script type="application/json">{"layout_box_budget":{"zones":[{"role":"title","x":100,"y":100,"w":1200,"h":160},{"role":"body","x":100,"y":400,"w":1200,"h":100}]}}</script>';

for (const [name, content] of [
  ["direct", text],
  ["wrapped", `<div>${text}</div>`],
  ["deeply-wrapped", `<div><div>${text}</div></div>`],
  ["sibling-wrappers", "<div><h1>Example title</h1></div><div><p>Example body.</p></div>"],
  ["mixed-container-text", "<div>Example title<p>Example body.</p></div>"],
  ["quoted-attribute", `<div title="a > b">${text}</div>`],
]) {
  test(name + ": missing markers and budget still fail", () => {
    expectMissing(check(name, content));
  });
}

for (const [name, content] of [
  ["marked-direct", marked],
  ["marked-wrapped", `<div>${marked}</div>`],
]) {
  test(name + ": valid control still passes", () => {
    const result = check(name, content, budget);
    assert.equal(result.exit, 0);
    assert.equal(result.status, "pass");
    assert.equal(result.summary.zones, 2);
    assert.equal(result.issues.length, 0);
  });
}

for (const [name, content] of [
  ["single-nested", "<div><div><p>One text block.</p></div></div>"],
  ["inline-spans", "<div><h1>One <span>text</span> block.</h1></div>"],
  ["comment-example", "<p>One text block.</p><!-- <h1>Not content</h1><p>Not content</p> -->"],
  ["script-example", '<p>One text block.</p><script type="application/json">{"example":"<h1>Not content</h1><p>Not content</p>"}</script>'],
  ["style-example", '<p>One text block.</p><style>.decoration::after { content: "<h1>Not content</h1><p>Not content</p>"; }</style>'],
]) {
  test(name + ": do not invent extra text blocks", () => {
    const result = check(name, content);
    assert.equal(result.exit, 0);
    assert.equal(result.status, "pass");
  });
}

test("wrapped CJK heading retains explicit orphan-line checks", () => {
  const result = check("cjk-heading", "<div><h1>这是一个标题<br>的</h1></div>");
  assert.equal(result.exit, 1);
  assert.ok(result.issues.some((item) => item.code === "cjk_orphan_line"));
});

test("a semantic title wrapper retains its heading checks", () => {
  const result = check("title-wrapper", '<div class="title"><p>这是一个标题<br>的</p></div>');
  assert.equal(result.exit, 1);
  assert.ok(result.issues.some((item) => item.code === "cjk_orphan_line"));
  assert.ok(!result.issues.some((item) => item.code === "missing_data_zones"));
});

test("nested headings retain inherited line-height", () => {
  const result = check("inherited-line-height", '<div style="line-height:1.01"><h1>这是一个标题</h1></div>');
  assert.equal(result.exit, 1);
  assert.ok(result.issues.some((item) => item.code === "unsafe_cjk_display_line_height"));
});
