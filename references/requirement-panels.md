# Requirement Panels

Use this file when entering PPT Requirement Discovery after the active Design DNA is accepted, or when the user asks to inspect or adjust the intake choices.

## Standard Chinese PPT Requirement Panel

```text
Design DNA：<dna-name>（当前仅用于本次 PPT；满意后可保存为 Design Profile）
现在进入 PPT 需求阶段。请直接回复选项编号即可，例如：1A 2E 3B 4C 5A 6D 7B 8A。

1. PPT 主题？
A. AI 产品 / 项目展示
B. 研究、论文或学术主题
C. 商业计划 / 创业路演
D. 课程、教程或培训内容
E. 个人作品集 / 工作展示
F. 其他 / 自定义

2. 这份 PPT 的用途？
A. 汇报
B. 路演
C. 课程 / 教学
D. 答辩
E. 培训
F. 公开演讲
G. 其他 / 自定义

3. 目标受众？
A. 老师
B. 同学
C. 客户
D. 团队
E. 投资人
F. 公开观众
G. 其他 / 自定义

4. 页数？
A. 自动规划
B. 5-7 页
C. 8-12 页
D. 15-20 页
E. 自定义页数

5. 内容来源？
A. 我提供材料
B. AI 根据主题组织 / 生成
C. 基于某个本地文件或粘贴文档
D. 混合：我给材料，AI 帮我整理
E. 其他 / 自定义

6. 信息密度？
A. 极简，适合演讲
B. 平衡，适合展示和阅读
C. 信息密集，适合汇报 / 答辩
D. 分章节自适应

7. 图片策略？
A. 不放内容图，用 Design DNA 视觉、排版、图形和动效完成
B. 我会提供内容图片，围绕图片设计页面
C. 预留可替换图片位，但不要做丑的空框
D. AI 生成概念 / 氛围视觉图
E. 混合

8. 输出格式？
A. 只要 HTML
B. HTML + PPTX
C. HTML + PDF
D. HTML + PDF + PPTX
E. 先看 HTML，再决定是否导出
```

## Existing Deck Renovation Intake

Use this compact panel only after inspecting the existing deck source enough to understand its current state.

```text
我已经先把现有 deck 当作内容来源处理。现在需要确认改造方式，请直接回复选项编号，例如：1A 2B 3C 4A。

1. 改造目标？
A. 保留内容，整体重做视觉
B. 保留大部分设计，只做排版/层级/可读性优化
C. 转成 HTML 网页 PPT
D. 只改封面、章节页或指定页面
E. 内容和视觉都重写

2. 风格来源？
A. 沿用现有 deck 的风格并优化
B. 使用参考图提取 Design DNA
C. 使用已保存的 Design Profile / Adapter
D. 无参考图，先做 Design Discovery

3. 内容保真度？
A. 文案和顺序尽量不变
B. 可以压缩、合并、拆页
C. 可以重写表达，但保留事实和结构
D. 按新叙事重新组织

4. 输出？
A. 只要 HTML
B. HTML + PDF
C. HTML + PPTX
D. HTML + PDF + PPTX
E. 先看 HTML，再决定导出
```

## Defaults

- If the user says "default", choose a balanced reading/presentation density, preserve factual content, and output HTML only.
- If the existing deck is very dense, prefer split slides over shrinking text.
- If the existing deck has recognizable images, treat them as content images only when the user wants them preserved.
