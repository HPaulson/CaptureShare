<template>
  <div v-if="this.$store.getters.user" class="home">
    <homeComponet />
  </div>
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
    description: config.meta.description,
    image: config.meta.image,
    thumbnail: config.meta.thumbnail,
    "theme-color": config.meta.color,
    url: config.meta.url
  }
};
</script>
