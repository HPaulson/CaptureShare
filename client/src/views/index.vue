<template>
  <div class="home" style="height: 100vh; max-width: 100%">
        <router-view></router-view>
  </div>
</template>

<script>

import config from "../../../app/config.json";
export default {
  name: "index",
  metaInfo: {
      "title": config.meta.title,
      "description": config.meta.description,
      "image": config.meta.image,
      "thumbnail": config.meta.thumbnail,
      "theme-color": config.meta.color,
      "url": config.meta.url
    }
}
</script>
