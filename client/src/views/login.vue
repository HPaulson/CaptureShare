<template>
  <div class="home" style="height: 100vh; max-width: 100%">
    <loginComponet />
  </div>
</template>

<script>
import loginComponet from "@/components/login.vue";
import config from "../../../app/config.json";
export default {
  name: "Login",
  components: {
    loginComponet
  },
  metaInfo: {
    title: config.meta.title,
    description: config.meta.description,
    image: config.meta.image,
    thumbnail: config.meta.thumbnail,
    "theme-color": config.meta.color,
    url: config.meta.url
  }
};
</script>
