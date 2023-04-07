<template>
  <a :class="className" role="button" @click="toggle"> Light / Dark </a>
</template>

<script setup>
import { onMounted, defineProps, computed, watch } from "vue";

const props = defineProps({
  className: {
    type: String,
    default: "dropdown-item",
  },
});

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = function (theme) {
  if (
    theme === "auto" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }
};

onMounted(() => {
  setTheme(getPreferredTheme());
});


const toggle = () => {
  getPreferredTheme() === "light" ? setTheme("dark") : setTheme("light");
};
</script>
