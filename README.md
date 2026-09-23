# Insight Log 官方网站源码

本仓库为 **Insight Log** 桌面客户端的官方介绍单页静态站点源码。

- **线上发布地址 (GitHub Pages)**: [https://zyf8827.github.io/insight-log-website/](https://zyf8827.github.io/insight-log-website/)
- **产品主仓库**: [zyf8827/insight-log](https://github.com/zyf8827/insight-log)

## 站点结构

```text
insight-log-website/
├── assets/
│   ├── logo.png       # 产品品牌 Logo 图标
│   └── hero.png       # 桌面端主界面预览实拍图
├── index.html         # 单页静态站主 HTML
├── style.css          # 现代化浅色主题样式与响应式设计
├── script.js          # 交互脚本（一键复制、管道过滤交互模拟器）
├── .nojekyll          # 禁用 GitHub Pages Jekyll 处理
├── LICENSE            # MIT 许可证
└── README.md          # 仓库说明文档
```

## 本地预览

本站为纯静态站点，无构建编译依赖。使用任意静态服务器即可在本地预览：

```bash
# 方式 1：使用 Python 3
python3 -m http.server 8080

# 方式 2：使用 Node.js / npx serve
npx serve .

# 方式 3：直接使用 VS Code / IDE 的 Live Server 插件
```

打开浏览器访问 `http://localhost:8080` 即可。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
