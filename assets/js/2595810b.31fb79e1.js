"use strict";(self.webpackChunkchess297_website=self.webpackChunkchess297_website||[]).push([[453],{1818:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>a,frontMatter:()=>t,metadata:()=>i,toc:()=>h});const i=JSON.parse('{"id":"server/nestjs/l1","title":"\u5165\u95e8","description":"\u7b80\u4ecb","source":"@site/docs/server/nestjs/l1.md","sourceDirName":"server/nestjs","slug":"/server/nestjs/l1","permalink":"/website/docs/server/nestjs/l1","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"serverSidebar","previous":{"title":"l1","permalink":"/website/docs/server/go-zero/l1"}}');var r=s(6070),l=s(8861);const t={sidebar_position:1},d="\u5165\u95e8",c={},h=[{value:"\u7b80\u4ecb",id:"\u7b80\u4ecb",level:2},{value:"\u57fa\u672c\u6982\u5ff5",id:"\u57fa\u672c\u6982\u5ff5",level:2},{value:"\u6a21\u5757",id:"\u6a21\u5757",level:3},{value:"\u63a7\u5236\u5668",id:"\u63a7\u5236\u5668",level:3},{value:"\u63d0\u4f9b\u8005",id:"\u63d0\u4f9b\u8005",level:3},{value:"\u4f9d\u8d56\u6ce8\u5165",id:"\u4f9d\u8d56\u6ce8\u5165",level:3},{value:"\u4e2d\u95f4\u4ef6",id:"\u4e2d\u95f4\u4ef6",level:3},{value:"\u5b88\u536b",id:"\u5b88\u536b",level:3},{value:"\u62e6\u622a\u5668",id:"\u62e6\u622a\u5668",level:3},{value:"\u7ba1\u9053",id:"\u7ba1\u9053",level:3},{value:"\u5f02\u5e38\u8fc7\u6ee4\u5668",id:"\u5f02\u5e38\u8fc7\u6ee4\u5668",level:3},{value:"\u88c5\u9970\u5668",id:"\u88c5\u9970\u5668",level:3}];function o(e){const n={h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u5165\u95e8",children:"\u5165\u95e8"})}),"\n",(0,r.jsx)(n.h2,{id:"\u7b80\u4ecb",children:"\u7b80\u4ecb"}),"\n",(0,r.jsx)(n.p,{children:"NestJS \u662f\u4e00\u4e2a\u7528\u4e8e\u6784\u5efa\u9ad8\u6548\u3001\u53ef\u6269\u5c55\u7684\u670d\u52a1\u5668\u7aef\u5e94\u7528\u7a0b\u5e8f\u7684\u6846\u67b6\u3002\u5b83\u57fa\u4e8e TypeScript \u5e76\u5229\u7528\u4e86\u73b0\u4ee3\u7684 JavaScript \u7279\u6027\uff0c\u5982\u7c7b\u3001\u88c5\u9970\u5668\u548c\u6a21\u5757\u7cfb\u7edf\u3002NestJS \u63d0\u4f9b\u4e86\u4e00\u7ec4\u5de5\u5177\u548c\u5e93\uff0c\u7528\u4e8e\u7b80\u5316\u5f00\u53d1\u8fc7\u7a0b\uff0c\u5e76\u63d0\u4f9b\u4e86\u4e00\u4e2a\u4e00\u81f4\u7684\u5f00\u53d1\u4f53\u9a8c\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"\u57fa\u672c\u6982\u5ff5",children:"\u57fa\u672c\u6982\u5ff5"}),"\n",(0,r.jsx)(n.h3,{id:"\u6a21\u5757",children:"\u6a21\u5757"}),"\n",(0,r.jsx)(n.p,{children:"\u6a21\u5757\u662f NestJS \u5e94\u7528\u7a0b\u5e8f\u7684\u57fa\u672c\u6784\u5efa\u5757\u3002\u5b83\u662f\u4e00\u4e2a\u5305\u542b\u4e00\u7ec4\u76f8\u5173\u529f\u80fd\u7684\u7c7b\uff0c\u8fd9\u4e9b\u7c7b\u53ef\u4ee5\u88ab\u7ec4\u5408\u5728\u4e00\u8d77\u4ee5\u6784\u5efa\u4e00\u4e2a\u5b8c\u6574\u7684\u5e94\u7528\u7a0b\u5e8f\u3002\u6a21\u5757\u53ef\u4ee5\u5305\u542b\u63a7\u5236\u5668\u3001\u63d0\u4f9b\u8005\u548c\u5bfc\u5165\u7684\u5176\u4ed6\u6a21\u5757\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u63a7\u5236\u5668",children:"\u63a7\u5236\u5668"}),"\n",(0,r.jsx)(n.p,{children:"\u63a7\u5236\u5668\u662f\u5904\u7406 HTTP \u8bf7\u6c42\u7684\u7c7b\u3002\u5b83\u5b9a\u4e49\u4e86\u4e00\u7ec4\u8def\u7531\u548c\u5904\u7406\u8fd9\u4e9b\u8def\u7531\u7684\u65b9\u6cd5\u3002\u63a7\u5236\u5668\u901a\u5e38\u7528\u4e8e\u5904\u7406\u7528\u6237\u8bf7\u6c42\uff0c\u5e76\u8fd4\u56de\u54cd\u5e94\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u63d0\u4f9b\u8005",children:"\u63d0\u4f9b\u8005"}),"\n",(0,r.jsx)(n.p,{children:"\u63d0\u4f9b\u8005\u662f\u5e94\u7528\u7a0b\u5e8f\u7684\u4e00\u90e8\u5206\uff0c\u5b83\u63d0\u4f9b\u4e86\u4e00\u4e9b\u529f\u80fd\u6216\u670d\u52a1\u3002\u63d0\u4f9b\u8005\u53ef\u4ee5\u662f\u7c7b\u3001\u51fd\u6570\u6216\u503c\u3002\u63d0\u4f9b\u8005\u53ef\u4ee5\u88ab\u6ce8\u5165\u5230\u5176\u4ed6\u7c7b\u4e2d\uff0c\u4ee5\u4fbf\u5728\u9700\u8981\u65f6\u4f7f\u7528\u5b83\u4eec\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u4f9d\u8d56\u6ce8\u5165",children:"\u4f9d\u8d56\u6ce8\u5165"}),"\n",(0,r.jsx)(n.p,{children:"\u4f9d\u8d56\u6ce8\u5165\u662f\u4e00\u79cd\u8bbe\u8ba1\u6a21\u5f0f\uff0c\u5b83\u5141\u8bb8\u4e00\u4e2a\u7c7b\u8bf7\u6c42\u5176\u4ed6\u7c7b\u7684\u670d\u52a1\u3002\u5728 NestJS \u4e2d\uff0c\u4f9d\u8d56\u6ce8\u5165\u662f\u901a\u8fc7\u6784\u9020\u51fd\u6570\u53c2\u6570\u6765\u5b9e\u73b0\u7684\u3002\u5f53\u4e00\u4e2a\u7c7b\u9700\u8981\u4f7f\u7528\u5176\u4ed6\u7c7b\u7684\u670d\u52a1\u65f6\uff0c\u5b83\u53ef\u4ee5\u5c06\u8fd9\u4e9b\u670d\u52a1\u4f5c\u4e3a\u6784\u9020\u51fd\u6570\u53c2\u6570\u4f20\u9012\u7ed9\u5b83\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u4e2d\u95f4\u4ef6",children:"\u4e2d\u95f4\u4ef6"}),"\n",(0,r.jsx)(n.p,{children:"\u4e2d\u95f4\u4ef6\u662f\u5728\u8bf7\u6c42\u548c\u54cd\u5e94\u4e4b\u95f4\u6267\u884c\u7684\u51fd\u6570\u3002\u5b83\u53ef\u4ee5\u7528\u4e8e\u6267\u884c\u4e00\u4e9b\u901a\u7528\u7684\u4efb\u52a1\uff0c\u4f8b\u5982\u65e5\u5fd7\u8bb0\u5f55\u3001\u8eab\u4efd\u9a8c\u8bc1\u548c\u6388\u6743\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u5b88\u536b",children:"\u5b88\u536b"}),"\n",(0,r.jsx)(n.p,{children:"\u5b88\u536b\u662f\u4e00\u79cd\u62e6\u622a\u5668\uff0c\u5b83\u53ef\u4ee5\u5728\u8bf7\u6c42\u5230\u8fbe\u8def\u7531\u5904\u7406\u7a0b\u5e8f\u4e4b\u524d\u62e6\u622a\u8bf7\u6c42\uff0c\u5e76\u6839\u636e\u67d0\u4e9b\u6761\u4ef6\u6765\u51b3\u5b9a\u662f\u5426\u5141\u8bb8\u8bf7\u6c42\u7ee7\u7eed\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u62e6\u622a\u5668",children:"\u62e6\u622a\u5668"}),"\n",(0,r.jsx)(n.p,{children:"\u62e6\u622a\u5668\u662f\u4e00\u79cd\u62e6\u622a\u5668\uff0c\u5b83\u53ef\u4ee5\u5728\u8bf7\u6c42\u5230\u8fbe\u8def\u7531\u5904\u7406\u7a0b\u5e8f\u4e4b\u524d\u62e6\u622a\u8bf7\u6c42\uff0c\u5e76\u5728\u8bf7\u6c42\u5904\u7406\u5b8c\u6210\u540e\u62e6\u622a\u54cd\u5e94\u3002\u62e6\u622a\u5668\u53ef\u4ee5\u7528\u4e8e\u6267\u884c\u4e00\u4e9b\u901a\u7528\u7684\u4efb\u52a1\uff0c\u4f8b\u5982\u65e5\u5fd7\u8bb0\u5f55\u3001\u6570\u636e\u8f6c\u6362\u548c\u9519\u8bef\u5904\u7406\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u7ba1\u9053",children:"\u7ba1\u9053"}),"\n",(0,r.jsx)(n.p,{children:"\u7ba1\u9053\u662f\u4e00\u79cd\u62e6\u622a\u5668\uff0c\u5b83\u53ef\u4ee5\u5728\u8bf7\u6c42\u5230\u8fbe\u8def\u7531\u5904\u7406\u7a0b\u5e8f\u4e4b\u524d\u62e6\u622a\u8bf7\u6c42\uff0c\u5e76\u5728\u8bf7\u6c42\u5904\u7406\u5b8c\u6210\u540e\u62e6\u622a\u54cd\u5e94\u3002\u7ba1\u9053\u53ef\u4ee5\u7528\u4e8e\u6267\u884c\u4e00\u4e9b\u901a\u7528\u7684\u4efb\u52a1\uff0c\u4f8b\u5982\u6570\u636e\u9a8c\u8bc1\u548c\u8f6c\u6362\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u5f02\u5e38\u8fc7\u6ee4\u5668",children:"\u5f02\u5e38\u8fc7\u6ee4\u5668"}),"\n",(0,r.jsx)(n.p,{children:"\u5f02\u5e38\u8fc7\u6ee4\u5668\u662f\u4e00\u79cd\u62e6\u622a\u5668\uff0c\u5b83\u53ef\u4ee5\u5728\u8bf7\u6c42\u5230\u8fbe\u8def\u7531\u5904\u7406\u7a0b\u5e8f\u4e4b\u524d\u62e6\u622a\u8bf7\u6c42\uff0c\u5e76\u5728\u8bf7\u6c42\u5904\u7406\u5b8c\u6210\u540e\u62e6\u622a\u54cd\u5e94\u3002\u5f02\u5e38\u8fc7\u6ee4\u5668\u53ef\u4ee5\u7528\u4e8e\u6267\u884c\u4e00\u4e9b\u901a\u7528\u7684\u4efb\u52a1\uff0c\u4f8b\u5982\u9519\u8bef\u5904\u7406\u548c\u65e5\u5fd7\u8bb0\u5f55\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u88c5\u9970\u5668",children:"\u88c5\u9970\u5668"}),"\n",(0,r.jsx)(n.p,{children:"\u88c5\u9970\u5668\u662f\u4e00\u79cd\u5143\u7f16\u7a0b\u6280\u672f\uff0c\u5b83\u53ef\u4ee5\u7528\u4e8e\u4fee\u6539\u7c7b\u3001\u65b9\u6cd5\u548c\u5c5e\u6027\u7684\u884c\u4e3a\u3002\u88c5\u9970\u5668\u53ef\u4ee5\u7528\u4e8e\u6267\u884c\u4e00\u4e9b\u901a\u7528\u7684\u4efb\u52a1\uff0c\u4f8b\u5982\u65e5\u5fd7\u8bb0\u5f55\u3001\u9a8c\u8bc1\u548c\u6388\u6743\u3002"})]})}function a(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},8861:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>d});var i=s(758);const r={},l=i.createContext(r);function t(e){const n=i.useContext(l);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),i.createElement(l.Provider,{value:n},e.children)}}}]);