<template>
  <loginComponet />
</template>

<script>
import loginComponet from "@/components/login.vue";
import homeComponet from "@/components/home.vue";
import config from "../../../app/config.json";
export default {
  name: "Login",
  components: {
    loginComponet,
    homeComponet
  },
  metaInfo: {
    title: config.meta.title,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: config.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: config.meta.title },
      { property: "theme-color", content: config.meta.color },
      { property: "og:description", content: config.meta.description },
      { property: "og:image", content: config.meta.image },
      { property: "og:url", content: config.meta.url }
    ]
  }
};
</script>
