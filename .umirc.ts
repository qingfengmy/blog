import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "home/index" },
    { path: "/fenshizhekou", component: "fenshizhekou" },
    { path: "/toufangshiduan", component: "toufangshiduan" },
  ],
  npmClient: 'pnpm',
});
