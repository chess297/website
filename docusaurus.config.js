// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Viky\'s Blog',
  // tagline: '享受编程',
  url: 'https://viky-c.github.io/',
  baseUrl: '/blog/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // favicon: 'img/favicon.ico',
  organizationName: 'viky-c', // Usually your GitHub org/user name.
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
          // routeBasePath:'/',
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
      hideableSidebar:true,
      navbar: {
        hideOnScroll:true,
        items: [
          {
            type:'doc',
            docId: 'computer-basic/index',
            label: 'ComputerBasic',
            position:'left',
          },
          {
            type:'doc',
            docId: 'front-end/Vue/index',
            label: 'FrontEnd',
            position:'left',
          },
          {
            to:'/docs/english',
            label: 'English',
            position:'left'
          },
          {
            to:'/docs/math',
            label: 'Math',
            position:'left'
          },
          {
            type:'doc',
            docId: 'framework/前端架构/工程化/编码层面的工程化',
            label: 'Framework',
            position:'left'
          },
          // {
          //   type:'doc',
          //   docId: '关于面试/被面试/面试技巧',
          //   label: '关于面试',
          //   position:'left',
          // },
          {
            to:'/blog',
            label: 'Blog',
            position:'right'
          },
          {
            to: 'https://github.com/viky-c',
            label: "GitHub",
            position: 'right'
          }
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Viky's blog`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
