// SPDX-License-Identifier: MIT
// client/client.js — dsh-theme-cyberpunk 浏览器端主题插件（KIRA 赛博朋克版 · v0.3）。
//
// 完全独立于 dsh-theme-wallpaper：不引用、不依赖、不继承其任何规则。
// v0.3 赛博氛围全量升级（对齐 02-cyberpunk.html 个人主页的手法）：
//   背景层：透视网格 + 霓虹地平线 + 赛博太阳 + 城市天际线（SVG 霓虹窗）+ 雨幕 + 环境光 + 扫描线
//   字体：品牌/时间戳/终端条等宽科技字体（Cascadia Code/JetBrains Mono/Consolas）
//   霓虹：品牌文字+徽章多层光晕、导航项 hover 霓虹文字、气泡霓虹描边+辉光、
//         新对话按钮霓虹渐变描边、输入框聚焦霓虹、选中文本霓虹反色
//   动效：品牌周期 glitch（自动触发 + hover 加速）、徽章 hue 流转、
//         鼠标跟随霓虹光点尾迹、雨滴下落、天际线窗闪烁
//   终端：侧边栏底部 SYSTEM ONLINE ● + 实时 UTC 时钟 + 闪烁光标
// 护眼约束：霓虹亮度压住、雨幕/扫描线透明度低、正文对比度优先；
// prefers-reduced-motion 下关闭全部动画（含雨/光点/glitch/扫描线）。
// 纯 CSS/DOM，不产生任何模型可见内容。

(function () {
  'use strict'
  if (typeof window === 'undefined' || !window.__ModuleLoader__ || !window.__ModuleLoader__.load) return
  window.__ModuleLoader__.load({
    id: 'dsh-theme-cyberpunk',
    factory: function () {
      return {
        name: 'theme-cyberpunk-panel',
        inject: [],
        apply: function () { installTheme() },
      }
    },
  })
})()

function installTheme() {
  if (document.getElementById('dsh-theme-cyberpunk-style')) return
  // 【主题互斥·模板】其他主题已注入则本主题让位（勿删，详见 DSH-MEMORY.md 主题开发规范）
  const OTHER_THEME_STYLES = ['dsh-theme-wallpaper-style', 'dsh-theme-cyberpunk-style']
  for (let i = 0; i < OTHER_THEME_STYLES.length; i++) {
    if (OTHER_THEME_STYLES[i] !== 'dsh-theme-cyberpunk-style' && document.getElementById(OTHER_THEME_STYLES[i])) return
  }

  // 强制夜间模式
  document.documentElement.style.colorScheme = 'dark'
  document.body.setAttribute('data-ds-dark-theme', '')
  document.body.setAttribute('data-ds-theme-cyberpunk', '')

  const style = document.createElement('style')
  style.id = 'dsh-theme-cyberpunk-style'
  style.textContent = `
/* ============================================================
   KIRA 赛博朋克主题 · dsh-theme-cyberpunk v0.3
   ============================================================ */

:root {
  /* 霓虹色板 */
  --cyber-cyan:    #00e5ff;
  --cyber-cyan-lt: #2de0ff;
  --cyber-pink:    #ff2d95;
  --cyber-yellow:  #ffd23f;
  --cyber-green:   #3df2a5;
  --cyber-ink:     #0a0014;
  /* 科技感等宽字体栈 */
  --cyber-display: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Courier New',ui-monospace,monospace;
}

/* ---------- 背景层 ---------- */
html {
  color-scheme: dark !important;
  background: linear-gradient(180deg, #0a0014 0%, #12002b 55%, #1c0040 100%) !important;
}
.cyber-grid {
  position: fixed; left: -30%; right: -30%; top: -10%; height: 90vh; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.32) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.18) 1px, transparent 1px);
  background-size: 44px 44px;
  transform: perspective(460px) rotateX(62deg);
  transform-origin: 50% 0%;
  -webkit-mask-image: linear-gradient(180deg, #000 25%, transparent 90%);
  mask-image: linear-gradient(180deg, #000 25%, transparent 90%);
}
.cyber-horizon {
  position: fixed; left: 0; right: 0; top: 36vh; height: 2px; z-index: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.95) 30%, rgba(255, 45, 149, 0.9) 65%, transparent 100%);
  box-shadow: 0 0 28px rgba(0, 229, 255, 0.7), 0 0 90px rgba(255, 45, 149, 0.4);
}
/* 赛博太阳：骑在地平线上的黄→品红光晕 */
.cyber-sun {
  position: fixed; left: 50%; top: calc(36vh - 92px); z-index: 0; pointer-events: none;
  width: 150px; height: 150px; margin-left: -75px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 210, 63, 0.95) 0%,
    rgba(255, 210, 63, 0.35) 32%,
    rgba(255, 45, 149, 0.18) 56%,
    transparent 74%);
  box-shadow:
    0 0 44px rgba(255, 210, 63, 0.55),
    0 0 120px rgba(255, 210, 63, 0.25),
    0 0 200px rgba(255, 45, 149, 0.22);
  animation: cyber-sun-pulse 5s ease-in-out infinite;
}
@keyframes cyber-sun-pulse { 50% { transform: scale(1.07); opacity: 0.9; } }
/* 城市天际线：底部 SVG 剪影 + 霓虹窗 */
.cyber-skyline {
  position: fixed; left: 0; right: 0; bottom: 0; height: 24vh; z-index: 0; pointer-events: none;
  opacity: 0.85;
}
.cyber-skyline svg { width: 100%; height: 100%; display: block; }
.cyber-skyline .win { animation: cyber-win-blink 3.2s ease-in-out infinite; }
@keyframes cyber-win-blink { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.12; } }
/* 环境光斑 */
.cyber-ambient {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(640px 320px at 88% -5%, rgba(255, 45, 149, 0.20), transparent 60%),
    radial-gradient(720px 400px at -12% 108%, rgba(0, 229, 255, 0.16), transparent 60%);
}
/* 雨幕（JS 生成雨滴） */
#cyber-rain { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
#cyber-rain i {
  position: absolute; top: -18%; width: 1px;
  background: linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.22));
  opacity: 0.55;
  animation: cyber-rain-fall linear infinite;
}
@keyframes cyber-rain-fall { to { transform: translateY(135vh); } }
/* 扫描线 */
.cyber-scanlines {
  position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: 0.22;
  background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.55) 2px 4px);
  animation: cyber-scan-move 9s linear infinite;
}
@keyframes cyber-scan-move { from { background-position: 0 0; } to { background-position: 0 6px; } }
/* 鼠标霓虹光点尾迹 */
.cyber-cursor-dot {
  position: fixed; z-index: 9999; pointer-events: none;
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(0, 229, 255, 0.85);
  box-shadow: 0 0 6px rgba(0, 229, 255, 0.9), 0 0 14px rgba(0, 229, 255, 0.5);
  animation: cyber-dot-fade 0.7s ease-out forwards;
}
@keyframes cyber-dot-fade { to { opacity: 0; transform: translateY(10px); } }

/* ---------- 夜间 token 覆盖（深紫半透明面板，霓虹点缀） ---------- */
body, body[data-ds-dark-theme] {
  /* 全局字体：赛博等宽（拉丁/数字/代码） + 中文可读回退（与终端条同款字体栈） */
  --dsw-font-family: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Courier New','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif !important;
  --ds-font-family-code: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Liberation Mono',Menlo,Courier,'PingFang SC','Microsoft YaHei' !important;
  font-family: var(--dsw-font-family);

  --dsw-alias-bg-base: rgba(10, 4, 26, 0.20) !important;
  --dsw-alias-bg-layer-1: rgba(18, 8, 40, 0.28) !important;
  --dsw-alias-bg-layer-2: rgba(22, 10, 48, 0.34) !important;
  --dsw-alias-bg-layer-3: rgba(26, 12, 56, 0.42) !important;
  --dsw-alias-bg-module-platform: rgba(14, 6, 34, 0.26) !important;
  --dsw-alias-bg-multi-select: rgba(20, 9, 44, 0.32) !important;
  --dsw-alias-bg-overlay: rgba(22, 10, 48, 0.55) !important;
  --dsw-alias-bg-skeleton: rgba(0, 229, 255, 0.07) !important;

  --dsw-alias-label-primary: #bdf0ff !important;
  --dsw-alias-label-secondary: #9fd4f2 !important;
  --dsw-alias-label-tertiary: #7da8c8 !important;
  --dsw-alias-label-caption: #6b94b5 !important;
  --dsw-alias-label-dimmed: #59768f !important;

  --dsw-alias-brand-primary: #2de0ff !important;
  --dsw-alias-brand-text: #e4f3ff !important;
  --dsw-alias-brand-primary-invert: #0a0014 !important;
  --dsw-alias-button-primary-fill: #00d9ff !important;
  --dsw-alias-button-primary-hover: #33e6ff !important;
  --dsw-alias-button-primary-text: #0a0014 !important;
  --dsw-alias-button-info-fill: #00b8d4 !important;
  --dsw-alias-button-info-hover: #00d9ff !important;
  --dsw-alias-button-ghost-active-fill: rgba(0, 229, 255, 0.14) !important;
  --dsw-alias-button-ghost-active-hover: rgba(0, 229, 255, 0.22) !important;
  --dsw-alias-button-floating-fill: rgba(24, 10, 52, 0.88) !important;
  --dsw-alias-button-floating-hover: rgba(30, 14, 64, 0.94) !important;
  --dsw-alias-state-business-primary: #2de0ff !important;
  --dsw-alias-state-business-tertiary: rgba(0, 229, 255, 0.16) !important;
  --dsw-alias-state-warning-primary: #ffd23f !important;
  --dsw-alias-state-danger-primary: #ff4fa3 !important;
  --dsw-alias-state-success-primary: #3df2a5 !important;

  --dsw-alias-border-l1: rgba(0, 229, 255, 0.16) !important;
  --dsw-alias-border-l2: rgba(0, 229, 255, 0.26) !important;
  --dsw-alias-border-l3: rgba(255, 45, 149, 0.30) !important;
  --dsw-alias-border-l4: rgba(255, 45, 149, 0.42) !important;

  --dsw-alias-interactive-bg-hover: rgba(0, 229, 255, 0.12) !important;
  --dsw-alias-interactive-bg-active: rgba(0, 229, 255, 0.18) !important;
  --dsw-alias-interactive-bg-hover-accent: rgba(0, 229, 255, 0.20) !important;
  --dsw-alias-interactive-bg-hover-solid: rgba(30, 14, 64, 0.92) !important;

  --dsw-specific-bubble: rgba(26, 12, 54, 0.32) !important;
  --dsw-specific-bubble-highlight: rgba(38, 18, 78, 0.42) !important;

  --dsw-specific-sidebar-fill: rgba(8, 3, 20, 0.30) !important;
  --dsw-specific-sidebar-nav-item-active: rgba(30, 14, 64, 0.84) !important;
  --dsw-specific-sidebar-nav-item-active-accent: rgba(0, 229, 255, 0.32) !important;
  --dsw-specific-sidebar-nav-item-hover: rgba(22, 10, 48, 0.70) !important;

  --dsw-specific-input-major: rgba(8, 4, 20, 0.92) !important;
  --dsw-specific-selector: rgba(16, 7, 36, 0.32) !important;
  --dsw-specific-menu: rgba(20, 9, 44, 0.55) !important;
  --dsw-specific-tip: rgba(14, 6, 32, 0.74) !important;

  --dsw-alias-markdown-code-block: rgba(8, 3, 20, 0.74) !important;
  --dsw-alias-markdown-code-block-banner: rgba(14, 6, 32, 0.82) !important;
  --dsw-alias-markdown-inline-code: rgba(38, 18, 78, 0.82) !important;
  --dsw-alias-markdown-citation: rgba(26, 12, 54, 0.82) !important;
  --dsw-alias-markdown-tag: rgba(26, 12, 54, 0.82) !important;
  --dsw-alias-markdown-placeholder: rgba(14, 6, 32, 0.78) !important;
  --dsw-alias-markdown-code-segment-selected: rgba(30, 14, 64, 0.94) !important;
  --dsw-alias-markdown-code-segment-unselected: rgba(12, 5, 28, 0.88) !important;

  --dsw-alias-scrollbar-bg-l1: #2c1a52 !important;
  --dsw-alias-scrollbar-bg-l2: #3a2366 !important;
  --dsw-alias-scrollbar-hover-l1: #00d9ff !important;
  --dsw-alias-scrollbar-hover-l2: #33e6ff !important;

  --dsw-shadow-lv1: 0 1px 2px rgba(0, 0, 0, 0.35), 0 2px 10px rgba(0, 229, 255, 0.06) !important;
  --dsw-shadow-lv1-blur: 0 4px 18px rgba(0, 229, 255, 0.08) !important;
  --dsw-shadow-lv2: 0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(255, 45, 149, 0.10) !important;
  --dsw-shadow-lv3: 0 1px 2px rgba(0, 0, 0, 0.45), 0 10px 30px rgba(0, 0, 0, 0.45), 0 20px 60px rgba(0, 229, 255, 0.08) !important;

  --dsw-linear-gradient-think: linear-gradient(180deg, #12082c 20.19%, rgba(18, 8, 44, 0) 100%) !important;
  --dsw-linear-think-select: linear-gradient(180deg, #1a0c3c 20.19%, rgba(26, 12, 60, 0) 100%) !important;
}

/* ---------- shiki 代码高亮（霓虹系） ---------- */
body, body[data-ds-dark-theme] {
  --shiki-token-constant: #22d3ee !important;
  --shiki-token-string: #4ade80 !important;
  --shiki-token-comment: #7d8bb0 !important;
  --shiki-token-keyword: #ff4fa3 !important;
  --shiki-token-parameter: #fbbf24 !important;
  --shiki-token-function: #c084fc !important;
  --shiki-token-string-expression: #6ee7b7 !important;
  --shiki-token-punctuation: #cbd5e1 !important;
  --shiki-token-link: #38bdf8 !important;
}

/* ---------- 选中文本：霓虹反色 ---------- */
::selection { background: rgba(0, 229, 255, 0.35); color: #06121a; }

/* ---------- 聊天主区：半透明叠层（透出背景装饰，不设不透明底色） ---------- */
.wSkVaW_root {
  background:
    linear-gradient(rgba(8, 3, 22, 0.15), rgba(10, 4, 26, 0.22)),
    radial-gradient(1200px 500px at 50% -5%, rgba(0, 229, 255, 0.12), transparent 60%);
}

/* ---------- 侧边栏：半透明叠层（透出背景装饰） ---------- */
.hHd-Xa_root {
  background:
    linear-gradient(rgba(6, 2, 16, 0.60), rgba(8, 3, 20, 0.76));
}
/* 侧边栏导航项 hover：霓虹文字 */
.hHd-Xa_root a {
  transition: color var(--ds-transition-duration) var(--ds-ease-in-out),
              text-shadow var(--ds-transition-duration) var(--ds-ease-in-out);
}
.hHd-Xa_root a:hover {
  color: var(--cyber-cyan-lt) !important;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.2);
}

/* ---------- 品牌：等宽字体 + 霓虹光晕 + 自动 glitch ---------- */
.hHd-Xa_brand {
  font-family: var(--cyber-display) !important;
  letter-spacing: 0.14em !important;
}
.hHd-Xa_brand svg > path {
  opacity: 0.95;
  filter: drop-shadow(0 0 5px rgba(0, 229, 255, 0.85)) drop-shadow(0 0 14px rgba(0, 229, 255, 0.4));
  transition: opacity var(--ds-transition-duration) var(--ds-ease-in-out);
}
.hHd-Xa_brand svg rect {
  fill: url(#cyber-brand-grad) !important;
  filter: drop-shadow(0 0 5px rgba(255, 45, 149, 0.7)) drop-shadow(0 0 12px rgba(255, 45, 149, 0.3));
  animation: cyber-logo-hue 10s linear infinite;
}
.hHd-Xa_brand:hover svg rect { animation-duration: 4s; }
@keyframes cyber-logo-hue {
  from { filter: hue-rotate(0deg) drop-shadow(0 0 5px rgba(255, 45, 149, 0.7)); }
  to { filter: hue-rotate(360deg) drop-shadow(0 0 5px rgba(255, 45, 149, 0.7)); }
}
/* 品牌自动 glitch（每 7s 一次），hover 时高频 */
.hHd-Xa_brand { animation: cyber-glitch-auto 7s steps(1) infinite; }
.hHd-Xa_brand:hover { animation: cyber-glitch 0.45s steps(2, jump-none) infinite; }
@keyframes cyber-glitch-auto {
  0%, 96% { clip-path: none; transform: none; }
  96.4%  { clip-path: inset(12% 0 58% 0); transform: translateX(-2px); }
  96.8%  { clip-path: inset(62% 0 4% 0);  transform: translateX(2px); }
  97.2%  { clip-path: inset(30% 0 38% 0); transform: translateX(-1px); }
  97.6%  { clip-path: inset(0 0 64% 0);   transform: none; }
  98%    { clip-path: none; transform: none; }
}
@keyframes cyber-glitch {
  0%   { clip-path: inset(0 0 64% 0);  transform: translateX(-2px); }
  25%  { clip-path: inset(36% 0 6% 0); transform: translateX(2px);  }
  50%  { clip-path: inset(78% 0 0 0);  transform: translateX(-1px); }
  75%  { clip-path: inset(10% 0 58% 0); transform: translateX(1px); }
  100% { clip-path: inset(0 0 64% 0);  transform: translateX(0);    }
}

/* ---------- 用户气泡：霓虹描边 + 外辉光 + 毛玻璃 ---------- */
.gdEzaW_bubble {
  position: relative;
  border: 1px solid rgba(0, 229, 255, 0.5);
  box-shadow:
    0 0 16px rgba(0, 229, 255, 0.22),
    0 0 44px rgba(0, 229, 255, 0.08),
    0 2px 10px rgba(0, 0, 0, 0.35);
  -webkit-backdrop-filter: blur(12px) saturate(1.35);
  backdrop-filter: blur(12px) saturate(1.35);
}
.gdEzaW_bubble::after {
  content: "";
  position: absolute;
  right: -7px;
  bottom: 14px;
  width: 14px;
  height: 14px;
  background: inherit;
  border-right: 1px solid rgba(0, 229, 255, 0.5);
  border-bottom: 1px solid rgba(0, 229, 255, 0.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.35);
  backdrop-filter: blur(12px) saturate(1.35);
  transform: rotate(-45deg);
  border-bottom-right-radius: 3px;
}

/* ---------- 新对话按钮：霓虹渐变描边 + 辉光 ---------- */
.hHd-Xa_newSession {
  background: rgba(16, 7, 36, 0.78) !important;
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.38),
    0 0 16px rgba(0, 229, 255, 0.16),
    0 0 36px rgba(255, 45, 149, 0.10) !important;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: box-shadow var(--ds-transition-duration) var(--ds-ease-in-out),
              background var(--ds-transition-duration) var(--ds-ease-in-out);
}
.hHd-Xa_newSession:hover {
  background: rgba(26, 12, 56, 0.92) !important;
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.65),
    0 0 22px rgba(0, 229, 255, 0.30),
    0 0 50px rgba(255, 45, 149, 0.18) !important;
}

/* ---------- 全局赛博字体：侧边栏目录 / 标题 / 输入框 / 正文（仅换字体栈，不改字距字号） ---------- */
.hHd-Xa_root, .hHd-Xa_root * {
  font-family: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Courier New','PingFang SC','Microsoft YaHei',sans-serif !important;
}
h1, h2, h3, h4, h5 {
  font-family: var(--cyber-display) !important;
}
[contenteditable="true"] {
  font-family: var(--cyber-display) !important;
}
.gdEzaW_bubble { font-variant-numeric: tabular-nums; }

/* ---------- 霓虹文字色（克制版：标题/侧边栏发光，正文偏青白保可读） ---------- */
.hHd-Xa_root { color: #bfe9ff; }
.hHd-Xa_root a { color: #9fdcff; }
h1, h2, h3, h4, h5 {
  color: #9ff0ff;
  text-shadow:
    0 0 8px rgba(0, 229, 255, 0.75),
    0 0 26px rgba(0, 229, 255, 0.38);
}
.gdEzaW_bubble { color: #d9f4ff; }

/* ---------- 消息时间戳：等宽 + 常驻可见 ---------- */
[data-time-hover-root] :is(.p-xYUq_timeStart, .p-xYUq_timeEnd) {
  opacity: 1 !important;
  color: var(--dsw-alias-label-caption);
  font-family: var(--cyber-display);
  font-size: 11px;
  letter-spacing: 0.04em;
}

/* ---------- 代码块：霓虹描边 + 圆角 ---------- */
pre {
  border-radius: 12px;
  border: 1px solid rgba(0, 229, 255, 0.16);
  box-shadow: inset 0 0 24px rgba(0, 229, 255, 0.04);
}
:not(pre) > code { border-radius: 5px; }

/* ---------- 输入框聚焦：霓虹青光晕 ---------- */
[contenteditable="true"]:focus {
  outline: 2px solid rgba(0, 229, 255, 0.5);
  outline-offset: 1px;
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.26), 0 0 40px rgba(0, 229, 255, 0.10);
}

/* ---------- 终端状态条（侧边栏底部，JS 注入） ---------- */
#cyber-terminal {
  position: sticky;
  bottom: 0;
  z-index: 5;
  margin: 8px 10px;
  padding: 8px 12px;
  font-family: var(--cyber-display);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: #2de0ff;
  background: rgba(6, 2, 16, 0.86);
  border: 1px solid rgba(0, 229, 255, 0.32);
  border-radius: 8px;
  box-shadow: 0 0 14px rgba(0, 229, 255, 0.16);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}
#cyber-terminal .ct-dot {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--cyber-green);
  margin-right: 7px;
  vertical-align: 1px;
  box-shadow: 0 0 6px var(--cyber-green);
  animation: ct-blink 2.4s ease-in-out infinite;
}
#cyber-terminal .ct-cursor {
  color: var(--cyber-cyan-lt);
  animation: ct-blink 1s steps(2, jump-none) infinite;
}
@keyframes ct-blink { 50% { opacity: 0; } }

/* ---------- 终极统一方案 ----------
   ArkPixel 中文是位图转矢量的点阵字体，矢量轮廓在 12-14px 渲染时笔画落在
   像素边界间会产生抗锯齿糊化（每字笔画分布不同、糊化程度不同 → 观感"字体不一样"）。
   这是浏览器渲染硬伤，CSS 无法根除。
   决定：中文全部回系统字体（清晰统一），英文/数字/代码保持赛博等宽，
   霓虹颜色与发光特质全部保留。 */
.wSkVaW_root :not(pre):not(code):not(h1):not(h2):not(h3):not(h4):not(h5) {
  font-family: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Courier New','PingFang SC','Microsoft YaHei',sans-serif !important;
}
[contenteditable="true"] {
  font-family: 'Cascadia Code','JetBrains Mono','SF Mono','Consolas','Courier New','PingFang SC','Microsoft YaHei',sans-serif !important;
}
pre, code {
  font-family: var(--cyber-display) !important;
}

/* ---------- 背景升级 v0.14：霓虹广告招牌 + 远景纵深 + 动态增强 ---------- */
.cyber-sign {
  position: absolute;
  z-index: 1;
  font-family: var(--cyber-display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: #fff;
  text-shadow: 0 0 5px currentColor, 0 0 14px currentColor, 0 0 30px currentColor;
  border: 2px solid currentColor;
  background: rgba(8, 2, 20, 0.5);
  padding: 3px 9px;
  white-space: nowrap;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4), inset 0 0 8px rgba(0, 0, 0, 0.3);
  animation: cyber-sign-flicker var(--sd, 4.5s) ease-in-out infinite;
}
@keyframes cyber-sign-flicker {
  0%, 88%, 100% { opacity: 1; }
  90% { opacity: 0.3; }
  92% { opacity: 1; }
  95% { opacity: 0.55; }
  96.5% { opacity: 1; }
}
.cyber-far-skyline {
  position: absolute; left: 0; right: 0; bottom: 0; height: 36vh; z-index: 0; pointer-events: none;
}
.cyber-far-skyline svg { width: 100%; height: 100%; display: block; }
.cyber-far-skyline .beacon { animation: cyber-beacon-blink 2.4s ease-in-out infinite; }
@keyframes cyber-beacon-blink { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.08; } }
.cyber-sun {
  animation: cyber-sun-pulse 5s ease-in-out infinite, cyber-sun-hue 16s linear infinite;
}
@keyframes cyber-sun-hue {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
}
.cyber-horizon {
  animation: cyber-horizon-pulse 6s ease-in-out infinite;
}
@keyframes cyber-horizon-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.5), 0 0 70px rgba(255, 45, 149, 0.3); }
  50% { box-shadow: 0 0 34px rgba(0, 229, 255, 0.85), 0 0 120px rgba(255, 45, 149, 0.5); }
}
.cyber-skyline .win:nth-child(3n+1) { animation-duration: 4.6s; }
.cyber-skyline .win:nth-child(3n+2) { animation-duration: 3s; animation-delay: 0.7s; }
.cyber-skyline .win:nth-child(3n)   { animation-duration: 5.6s; animation-delay: 1.4s; }

/* ---------- 输入栏：terminal 风格（近黑底 + 霓虹描边 + 青色光标） ---------- */
div:has(> [contenteditable="true"]) {
  background: rgba(8, 4, 20, 0.94) !important;
  border: 1px solid rgba(0, 229, 255, 0.35) !important;
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
}
div:has(> [contenteditable="true"]):focus-within {
  border-color: rgba(0, 229, 255, 0.60) !important;
  box-shadow: 0 0 22px rgba(0, 229, 255, 0.22), inset 0 0 26px rgba(0, 229, 255, 0.05) !important;
}
[contenteditable="true"] {
  caret-color: #2de0ff;
}
/* ---------- 动画降级 ---------- */
@media (prefers-reduced-motion: reduce) {
  .cyber-scanlines, .cyber-sun, .cyber-horizon, .cyber-skyline .win, .cyber-far-skyline .beacon, .cyber-sign,
  #cyber-rain, .cyber-cursor-dot,
  .hHd-Xa_brand, .hHd-Xa_brand svg rect,
  #cyber-terminal .ct-dot, #cyber-terminal .ct-cursor {
    animation: none !important;
  }
  #cyber-rain, .cyber-cursor-dot { display: none !important; }
}
`

  document.head.appendChild(style)



  // ---------- 背景装饰层注入（幂等） ----------
  function injectBackdrop() {
    if (document.getElementById('cyber-backdrop')) return
    const wrap = document.createElement('div')
    wrap.id = 'cyber-backdrop'
    // z-index:0 + 前置到 body 开头：内容（DOM 顺序靠后）盖住背景层 → 不挡输入栏/气泡，
    // 且主区/侧边栏背景为半透明 → 太阳/地平线/大楼/雨幕/网格全部透出可见
    wrap.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden'
    // 天际线 SVG：暗紫建筑剪影 + 青色霓虹窗（随机闪烁）
    const skyline = `
<div class="cyber-skyline"><svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <g fill="#0d0626">
    <rect x="0" y="64" width="72" height="156"/><rect x="82" y="104" width="62" height="116"/>
    <rect x="152" y="42" width="92" height="178"/><rect x="252" y="92" width="56" height="128"/>
    <rect x="316" y="18" width="112" height="202"/><rect x="436" y="112" width="66" height="108"/>
    <rect x="512" y="56" width="82" height="164"/><rect x="602" y="8" width="132" height="212"/>
    <rect x="742" y="82" width="72" height="138"/><rect x="822" y="34" width="102" height="186"/>
    <rect x="932" y="106" width="62" height="114"/><rect x="1002" y="52" width="86" height="168"/>
    <rect x="1098" y="92" width="66" height="128"/><rect x="1172" y="24" width="122" height="196"/>
    <rect x="1302" y="72" width="76" height="148"/><rect x="1386" y="112" width="54" height="108"/>
  </g>
  <g fill="#00e5ff" class="win">
    <rect x="20" y="84" width="9" height="12"/><rect x="42" y="118" width="9" height="12"/>
    <rect x="170" y="64" width="9" height="12"/><rect x="196" y="100" width="9" height="12"/><rect x="222" y="150" width="9" height="12"/>
    <rect x="336" y="40" width="9" height="12"/><rect x="362" y="90" width="9" height="12"/><rect x="388" y="140" width="9" height="12"/>
    <rect x="530" y="78" width="9" height="12"/><rect x="556" y="126" width="9" height="12"/>
    <rect x="622" y="30" width="9" height="12"/><rect x="650" y="70" width="9" height="12"/><rect x="678" y="130" width="9" height="12"/><rect x="706" y="170" width="9" height="12"/>
    <rect x="842" y="58" width="9" height="12"/><rect x="870" y="110" width="9" height="12"/><rect x="898" y="156" width="9" height="12"/>
    <rect x="1022" y="74" width="9" height="12"/><rect x="1048" y="130" width="9" height="12"/>
    <rect x="1192" y="46" width="9" height="12"/><rect x="1220" y="92" width="9" height="12"/><rect x="1248" y="150" width="9" height="12"/>
    <rect x="1322" y="96" width="9" height="12"/><rect x="1348" y="144" width="9" height="12"/>
  </g>
</svg></div>`
  // 远景纵深：太阳背后的远层城市剪影（更暗更高）
  const farSkyline = `<svg class="cyber-far-skyline" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <g fill="#0a0522">
    <rect x="40" y="30" width="50" height="270"/><rect x="120" y="90" width="40" height="210"/>
    <rect x="200" y="10" width="70" height="290"/><rect x="300" y="60" width="45" height="240"/>
    <rect x="370" y="120" width="55" height="180"/><rect x="470" y="20" width="80" height="280"/>
    <rect x="580" y="70" width="50" height="230"/><rect x="660" y="0" width="90" height="300"/>
    <rect x="780" y="50" width="60" height="250"/><rect x="870" y="100" width="40" height="200"/>
    <rect x="940" y="30" width="75" height="270"/><rect x="1050" y="80" width="50" height="220"/>
    <rect x="1130" y="15" width="85" height="285"/><rect x="1245" y="60" width="55" height="240"/>
    <rect x="1330" y="40" width="70" height="260"/><rect x="1420" y="90" width="40" height="210"/>
  </g>
  <g fill="#ff2d95" class="beacon">
    <rect x="215" y="30" width="4" height="10"/><rect x="255" y="80" width="4" height="10"/>
    <rect x="490" y="40" width="4" height="10"/><rect x="525" y="110" width="4" height="10"/>
    <rect x="685" y="25" width="4" height="10"/><rect x="720" y="90" width="4" height="10"/>
    <rect x="960" y="55" width="4" height="10"/><rect x="1155" y="40" width="4" height="10"/>
    <rect x="1185" y="100" width="4" height="10"/><rect x="1350" y="65" width="4" height="10"/>
  </g>
</svg>`

  // 霓虹广告招牌（天空悬浮灯牌，各自独立闪烁频率）
  const signs = `
<div class="cyber-sign" style="color:#ff2d95;left:7%;top:16%;transform:rotate(-5deg);--sd:3.8s">カフェ</div>
<div class="cyber-sign" style="color:#00e5ff;left:21%;top:7%;transform:rotate(2deg);--sd:5.2s;animation-delay:.8s">電脳</div>
<div class="cyber-sign" style="color:#ffd23f;left:58%;top:10%;transform:rotate(-3deg);--sd:4.4s;animation-delay:.4s">NEON</div>
<div class="cyber-sign" style="color:#ff2d95;left:74%;top:20%;transform:rotate(3deg);--sd:6s;animation-delay:1.6s">喫茶</div>
<div class="cyber-sign" style="color:#00e5ff;left:87%;top:5%;transform:rotate(-2deg);--sd:3.2s;animation-delay:1.1s">夜</div>
<div class="cyber-sign" style="color:#ffd23f;left:13%;top:31%;transform:rotate(2deg);--sd:4.8s;animation-delay:2.2s">ゲーム</div>`
    wrap.innerHTML =
      '<div class="cyber-grid"></div>' +
      '<div class="cyber-horizon"></div>' +
      farSkyline +
      '<div class="cyber-sun"></div>' +
      '<div class="cyber-ambient"></div>' +
      skyline +
      signs +
      '<div id="cyber-rain"></div>'
    document.body.insertBefore(wrap, document.body.firstChild)

    // 扫描线单独挂最上层（覆盖全屏，不随 backdrop 降层）
    if (!document.querySelector('.cyber-scanlines')) {
      const scan = document.createElement('div')
      scan.className = 'cyber-scanlines'
      document.body.appendChild(scan)
    }

    // 生成雨滴
    const rain = document.getElementById('cyber-rain')
    const N = 56
    for (let i = 0; i < N; i++) {
      const d = document.createElement('i')
      const dur = (0.9 + Math.random() * 1.4).toFixed(2)
      const delay = (Math.random() * 2.4).toFixed(2)
      d.style.left = (Math.random() * 100).toFixed(2) + '%'
      d.style.height = (44 + Math.random() * 84).toFixed(0) + 'px'
      d.style.animationDuration = dur + 's'
      d.style.animationDelay = delay + 's'
      rain.appendChild(d)
    }
  }
  injectBackdrop()

  // 鼠标霓虹光点尾迹（限频 40ms，reduced-motion 跳过）
  function initCursorGlow() {
    if (window.__cyberCursorInit) return
    window.__cyberCursorInit = true
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let last = 0
    document.addEventListener('pointermove', function (e) {
      const now = performance.now()
      if (now - last < 40) return
      last = now
      const s = document.createElement('i')
      s.className = 'cyber-cursor-dot'
      s.style.left = (e.clientX + (Math.random() - 0.5) * 20) + 'px'
      s.style.top = (e.clientY + (Math.random() - 0.5) * 20) + 'px'
      document.body.appendChild(s)
      setTimeout(function () { s.remove() }, 720)
    })
  }
  initCursorGlow()

  // 侧边栏底部终端状态条（幂等，找不到容器则跳过）
  function injectTerminalBar() {
    if (document.getElementById('cyber-terminal')) return
    const sb = document.querySelector('.hHd-Xa_root')
    if (!sb) return
    const bar = document.createElement('div')
    bar.id = 'cyber-terminal'
    bar.innerHTML =
      '<span class="ct-dot"></span><span class="ct-text">SYSTEM ONLINE</span>' +
      '<span class="ct-cursor">▊</span>'
    sb.appendChild(bar)
    const textEl = bar.querySelector('.ct-text')
    if (textEl) {
      const tick = function () {
        const d = new Date()
        textEl.textContent = 'SYSTEM ONLINE // ' + d.toISOString().slice(11, 19) + ' UTC'
      }
      tick()
      setInterval(tick, 1000)
    }
  }
  injectTerminalBar()
  if (window.MutationObserver) {
    let tbTimer = null
    new MutationObserver(function () {
      if (document.getElementById('cyber-terminal')) return
      if (tbTimer) return
      tbTimer = setTimeout(function () { tbTimer = null; injectTerminalBar() }, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }

  // harness 徽章霓虹渐变（青 → 品红）：组件重渲染后自动补注
  function applyBrandGradient() {
    const svg = document.querySelector('.hHd-Xa_brand svg')
    if (!svg || svg.querySelector('#cyber-brand-grad')) return
    svg.insertAdjacentHTML('afterbegin',
      '<defs><linearGradient id="cyber-brand-grad" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="#00e5ff"/><stop offset="50%" stop-color="#2de0ff"/>' +
      '<stop offset="100%" stop-color="#ff2d95"/></linearGradient></defs>')
  }
  applyBrandGradient()
  if (window.MutationObserver) {
    let brandTimer = null
    new MutationObserver(function () {
      if (brandTimer) return
      brandTimer = setTimeout(function () { brandTimer = null; applyBrandGradient() }, 150)
    }).observe(document.body, { childList: true, subtree: true })
  }
}
