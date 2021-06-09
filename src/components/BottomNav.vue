<template>
  <div class="bottom-nav">
    <v-bottom-navigation v-if="$store.getters.isLogin" active-class="primary--text" app>
      <v-btn to="/home/top">
        <span>排行榜</span>
        <v-icon>mdi-align-vertical-bottom</v-icon>
      </v-btn>
      <v-btn to="/home/mv">
        <span>MV</span>
        <v-icon>mdi-movie</v-icon>
      </v-btn>
      <v-btn to="/">
        <span>首页</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/home/transceiver">
        <span>电台</span>
        <v-icon>mdi-folder-music</v-icon>
      </v-btn>
      <v-btn to="/home/singers">
        <span>歌手</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: "bottom-nav",
  data() {
    return {
    };
  },
};
</script>

<style>
</style>