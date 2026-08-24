# dsh-theme-cyberpunk — 维护说明

> ⚠️ **主题互斥**：DSH 主题插件二选一。装本主题前，先在插件管理里**停用其他主题插件**（如 dsh-theme-wallpaper）。若同时启用，后加载者会自动让位（client 内置互斥自检），但视觉以先加载者为准。

DSH Web GUI 独立主题插件（KIRA 赛博朋克）。与 `dsh-theme-wallpaper` 互不依赖，二选一启用。

## 最终版 v1.0.0（2026-08-17 定稿）

- **中文**（正文/标题/侧边栏/终端条）：系统字体（苹方/雅黑），清晰统一
- **英文/数字/代码**：赛博等宽（Cascadia Code → JetBrains Mono → Consolas）
- **输入栏**：terminal 风格（近黑不透底 + 青色霓虹描边 + 青色光标），输入时不与背景重叠
- **霓虹氛围**：深紫黑背景 + 透视网格 + 霓虹地平线（脉冲）+ 赛博太阳（hue 流转）+ 远景纵深 + 城市天际线（差异化闪烁窗）+ 霓虹广告招牌（独立闪烁）+ 雨幕 + 扫描线 + 鼠标光点 + 品牌 glitch + 侧边栏终端状态条
- **透明度**：全部面板经 --dsw-* token 调透（主区 0.20 / 气泡 0.32 / 侧边栏 0.30），招牌太阳透出
- client.js 约 28KB，加载极快

## 为什么中文不用像素字体（踩坑记录）

1. **ark-pixel 16px 的 woff2 是位图字体**（含 CBDT 表）→ Chrome 不支持渲染位图字体，静默失败零报错；
2. 16px/10px 的中文子集**覆盖残缺**（16px 仅 97 汉字、10px 仅 1076 字，"的/你/好/这/对话/系统"等高频字缺失）→ 混排参差；
3. 12px 全量版（18299 汉字）覆盖完整，但**位图转矢量后渲染糊化**（笔画落像素边界产生抗锯齿，每字糊化不同 → 观感"字体不一样"），CSS 无法根除。

结论：**中文像素字体在当前浏览器技术下不可用**，最终采用"中文系统 + 英文等宽"。

## 安装/更新要点（重要）

- **安装**：`pnpm add file:<你的插件目录>/dsh-theme-cyberpunk` 后，必须把包名加进 profile `package.json` 的 `dsh.profile.bundles` 数组（否则 entry 显示 unmounted，client 不注入）；
- **实体**：`node_modules/dsh-theme-cyberpunk` 已替换为 **junction** 指向源目录（`mklink /J`），改源文件即时可见，无需同步副本；
- **生效**：改 client.js 后**必须重启 dsh web**（生产模式 client-modules 启动时扫描缓存，无 HMR watch）；
- **切换主题**：插件管理里开关 `theme-wallpaper` / `theme-cyberpunk` entry 二选一；
- **cordis.patch.yml**：只含 `theme-wallpaper disabled` 标记（插件管理器托管），勿手动改。

## 结构

```
dsh-theme-cyberpunk/
├── package.json        # bundle 声明 + dsh.client
├── index.mjs           # cordis 占位工厂
├── cordis.patch.yml    # bundle 层 insert
├── client/client.js    # 全部主题逻辑（CSS 注入 + 背景/终端条/光点）
└── font/               # 字体归档（12px 全量 zip 等，供未来参考）
```
