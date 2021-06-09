<template>
  <div class="about">
    <v-row class="text-center" justify="center">
      <v-col class="mt-15" cols="12">
        <v-avatar size="60">
          <img
            src="https://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg"
            alt="logo"
          />
        </v-avatar>

        <div class="title mt-2">MD网易云音乐</div>
        
        <v-footer class="primary white--text" padless absolute>
          <v-col class="text-center" cols="12">
            Powered By NeteaseCloudMusic
          </v-col>
        </v-footer>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {};
  },
};
</script>