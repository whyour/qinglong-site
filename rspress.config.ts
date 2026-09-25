import { defineConfig } from "rspress/config";
import { pluginFontOpenSans } from "rspress-plugin-font-open-sans";

export default defineConfig({
  root: "docs",
  // Rspress 1.x gives global metadata priority over locale metadata.
  title: "",
  description: "",
  markdown: {
    checkDeadLinks: true,
  },
  lang: "zh",
  locales: [
    {
      lang: "zh",
      label: "简体中文",
    },
    {
      lang: "en",
      label: "English",
    },
  ],
  icon: "https://qn.whyour.cn/favicon.svg",
  logo: {
    light: "/logo-light.png",
    dark: "/logo-dark.png",
  },
  plugins: [pluginFontOpenSans()],
  builderConfig: {
    source: {
      define: {
        "process.env.DOCUMATE_BACKEND_URL": JSON.stringify(
          process.env.DOCUMATE_BACKEND_URL
        ),
      },
    },
  },
  route: {
    cleanUrls: true,
  },
  themeConfig: {
    enableContentAnimation: true,
    enableScrollToTop: true,
    footer: {
      message: `<p>© ${new Date().getFullYear()} Qinglong Inc. All Rights Reserved.<a href="https://beian.miit.gov.cn/" style="margin-left: 4px" target="_blank" rel="noopener noreferrer">京ICP备19049168号-4</a></p>`,
    },
    hideNavbar: "auto",
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/whyour/qinglong",
      },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 50 50">
<path d="M25,2c12.703,0,23,10.297,23,23S37.703,48,25,48S2,37.703,2,25S12.297,2,25,2z M32.934,34.375	c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219	c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966	c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693	c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351	c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z"></path>
</svg>`,
        },
        mode: "link",
        content: "https://t.me/jiao_long",
      },
    ],
    locales: [
      {
        lang: "zh",
        title: "青龙文档",
        description: "青龙定时任务管理平台的部署、脚本、CLI 与 API 使用文档。",
        label: "简体中文",
        overview: {
          filterNameText: "筛选",
          filterPlaceholderText: "搜索文档",
          filterNoResultText: "未找到相关文档",
        },
        editLink: {
          docRepoBaseUrl: "https://github.com/whyour/qinglong-site/edit/main/docs",
          text: "📝 在 GitHub 上编辑此页",
        },
        prevPageText: "上一篇",
        nextPageText: "下一篇",
        outlineTitle: "目录",
        searchPlaceholderText: "搜索",
        searchNoResultsText: "未搜索到相关结果",
        searchSuggestedQueryText: "可更换不同的关键字后重试",
      },
      {
        lang: "en",
        title: "Qinglong Docs",
        description: "Deployment, scripts, CLI and API documentation for the Qinglong task management platform.",
        label: "English",
        editLink: {
          docRepoBaseUrl: "https://github.com/whyour/qinglong-site/edit/main/docs",
          text: "📝 Edit this page on GitHub",
        },
        searchPlaceholderText: "Search",
      },
    ],
  },
});
