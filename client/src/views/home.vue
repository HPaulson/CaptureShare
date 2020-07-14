<template>
  <homeComponet v-if="this.$store.getters.user" />
</template>

<script>
import homeComponet from "@/components/home.vue";
import config from "../../../app/config.json";
export default {
  name: "Home",
  components: {
    homeComponet
  },
  created() {
    if (!this.$store.getters.user) this.$router.push("/login");
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
