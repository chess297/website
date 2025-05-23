import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: "autogenerated", dirName: "." }],
  frontendSidebar: [{ type: "autogenerated", dirName: "frontend" }],
  clientSidebar: [{ type: "autogenerated", dirName: "client" }],
  backendSidebar: [{ type: "autogenerated", dirName: "backend" }],
  devopsSidebar: [{ type: "autogenerated", dirName: "devops" }],
  databaseSidebar: [{ type: "autogenerated", dirName: "database" }],
  securitySidebar: [{ type: "autogenerated", dirName: "security" }],
  // workspaceSidebar: [{ type: "autogenerated", dirName: "workspace" }],
  // aiSidebar: [{ type: "autogenerated", dirName: "ai" }],
  // aiSidebar: [{ type: "autogenerated", dirName: "ai" }],
  // But you can create a sidebar manually
  // docsSidebar: [
  //   "intro",
  //   {
  //     type: "category",
  //     label: "Docs",
  //     items: ["tutorial-basics/create-a-document"],
  //   },
  // ],
  // webSidebar: [
  //   "intro",
  //   {
  //     type: "category",
  //     label: "Web",
  //     items: ["tutorial-basics/create-a-document"],
  //   },
  // ],
};

export default sidebars;
