import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import EnvironmentPlugin from "vite-plugin-environment";

const path = require("path");
const API_BACKEND = "https://oj.ebg.tw";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    EnvironmentPlugin({
      VUE_APP_HASH: (+new Date())
        .toString(Math.floor(Math.random() * 5) + 32)
        .slice(-8),
      VUE_APP_VERSION: require("./package.json").version,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    proxy: {
      "^/api": {
        target: API_BACKEND,
        changeOrigin: true,
        headers: { referer: API_BACKEND },
      },
      "^/public": {
        target: API_BACKEND,
        changeOrigin: true,
        headers: { referer: API_BACKEND },
      },
    },
  },
});
