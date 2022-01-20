// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '陈运棋的个人播客',
  tagline: 'Dinosaurs are cool',
  url: 'https://chenkhat.github.io/',
  baseUrl: '/blog/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // favicon: 'img/favicon.ico',
  organizationName: 'ChenKhat', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  deploymentBranch: 'deploy',
  trailingSlash:false,
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl: 'https://github.com/ChenKhat/blog/tree/main/docs',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle:'最新文章',
          blogSidebarCount: 10,
          // Please change this to your repo.
          routeBasePath:'/',
          // editUrl:
          //   'https://github.com/ChenKhat/blog/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        items: [
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} 陈运棋 blog`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
