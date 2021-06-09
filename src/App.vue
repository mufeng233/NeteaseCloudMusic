<template>
  <div id="app">
    <v-app>
      <appbar></appbar>
      <v-main>
        <v-container fluid>
          <router-view :key="$route.fullPath" />
        </v-container>
      </v-main>
      <bottom-player></bottom-player>
      <bottom-nav></bottom-nav>
    </v-app>
  </div>
</template>

<script>
import Appbar from "./components/Appbar";
import BottomNav from "./components/BottomNav";
import BottomPlayer from "./components/BottomPlayer";


export default {
  name: "app",
  mounted() {
    /* if (this.$store.state.cookie) {
      this.$dialog.info({
        // eslint-disable-next-line vue/no-parsing-error
        text: "新增MV播放功能<br/>现在你可以关注用户了",
        title: "公告",
      });
    } */
  },
  components: {
    Appbar,
    BottomNav,
    BottomPlayer,
  },
};
</script>
