import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Chess‘ Site",
  tagline: "书读百遍其义自见",
  // favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://chess297.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/website/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "chess297", // Usually your GitHub org/user name.
  projectName: "website", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/Chess-chen/website",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Chess' Site",
      logo: {
        alt: "Chess' Site",
        src: "img/avatar.jpeg",
        style: {
          borderRadius: "50%",
        },
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "frontendSidebar",
          position: "left",
          label: "Frontend",
        },
        {
          type: "docSidebar",
          sidebarId: "clientSidebar",
          position: "left",
          label: "Client",
        },
        {
          type: "docSidebar",
          sidebarId: "backendSidebar",
          position: "left",
          label: "Backend",
        },
        {
          type: "docSidebar",
          sidebarId: "databaseSidebar",
          position: "left",
          label: "Database",
        },
        {
          type: "docSidebar",
          sidebarId: "devopsSidebar",
          position: "left",
          label: "Devops",
        },
        // {
        //   type: "docSidebar",
        //   sidebarId: "aiSidebar",
        //   position: "left",
        //   label: "AI",
        // },
        {
          href: "https://github.com/chess297",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
