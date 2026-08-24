// index.mjs — dsh-theme-cyberpunk host 插件入口（占位）。
//
// 纯客户端主题插件：所有样式由 client/client.js 在浏览器端注入。
// host 侧无需注册任何服务，但必须存在一个 cordis 插件工厂，
// 使本包成为 loader entry（client-modules 只扫描 loader entries 中
// 声明了 dsh.client 的包）。
// 与 dsh-theme-wallpaper 完全独立：互不引用、二选一启用。

export const name = 'theme-cyberpunk'

export function apply(ctx, config = {}) {
  // 无 host 侧逻辑
}
