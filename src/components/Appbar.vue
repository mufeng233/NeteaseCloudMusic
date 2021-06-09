<template>
  <div class="appbar" v-if="userInfo">
    <v-app-bar v-if="$store.getters.isLogin" color="primary" dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>网易云音乐</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn :to="'/message/private?id='+userInfo.userId" icon>
        <v-icon>mdi-email</v-icon>
      </v-btn>

      <v-btn @click="$vuetify.theme.dark = !$vuetify.theme.dark" icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <!-- <template v-slot:extension>
        <v-tabs centered center-active show-arrows>
          <v-tabs-slider color="white"></v-tabs-slider>
          <v-tab to="/">首页</v-tab>
          <v-tab to="/home/top">排行榜</v-tab>
          <v-tab to="/home/transceiver">电台</v-tab>
          <v-tab to="/home/singers">歌手</v-tab>
        </v-tabs>
      </template> -->
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      v-if="userInfo && levelInfo && $store.getters.isLogin"
      app
      disable-resize-watcher
      clipped
    >
      <v-list disabled>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="userInfo.avatarUrl"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content @click="levelInfoDialog = true">
            <v-list-item-title class="title">
              {{ userInfo.nickname }}
              <v-badge
                :content="'LV.' + levelInfo.level"
                bordered
                inline
                overlap
              ></v-badge>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userInfo.signature }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="primary--text">
          <v-list-item to="/">
            <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item>

          <v-list-item to="/search">
            <v-list-item-icon
              ><v-icon>mdi-cloud-search</v-icon></v-list-item-icon
            >
            <v-list-item-title>搜索</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/user/home/' + userInfo.userId">
            <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
            <v-list-item-title>个人中心</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item to="/about">
            <v-list-item-icon
              ><v-icon>mdi-information-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>关于</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn color="error" @click="logoutDialog = true" block>
            <v-icon>mdi-exit-to-app</v-icon> 退出登录
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-dialog v-model="logoutDialog" max-width="290">
      <v-card>
        <v-card-title>确定退出登录？</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="logout">确定</v-btn>

          <v-btn color="primary" text @click="logoutDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="levelInfoDialog"
      v-if="levelInfo"
      transition="dialog-top-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark>等级信息</v-toolbar>
        <v-card-text class="text-center my-5">
          <p class="title">
            距离下一级：
            <v-badge
              :content="'LV' + (levelInfo.level + 1)"
              bordered
              inline
              overlap
            ></v-badge>
          </p>
          <v-progress-circular
            class="mr-3"
            size="120"
            :value="(levelInfo.nowPlayCount / levelInfo.nextPlayCount).toFixed(2) * 100"
            color="accent"
            >还需{{
              levelInfo.nextPlayCount - levelInfo.nowPlayCount
            }}首歌</v-progress-circular
          >
          <v-progress-circular
            size="120"
            :value="(levelInfo.nextLoginCount / levelInfo.nowLoginCount).toFixed(2) * 100"
            color="secondary"
            >还需{{
              levelInfo.nextLoginCount - levelInfo.nowLoginCount
            }}天</v-progress-circular
          >
          <p>
            <span class="mr-10">听歌量</span>
            <span class="ml-12">登录天数</span>
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="levelInfoDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "appbar",
  data() {
    return {
      logoutDialog: false,
      levelInfoDialog: false,
      drawer: false,
      userInfo: null,
      levelInfo: null,
    };
  },
  methods: {
    logout() {
      this.logoutDialog = false;
      this.drawer = false;

      window.localStorage.removeItem("cookie");
      // this.$cookies.remove("cookie");
      // this.$router.push('/login');
      window.location.reload();
    },
  },
  created() {
    this.axios({
      method: "get",
      url:
        "/user/account?cookie=" + encodeURIComponent(this.$store.state.cookie),
    }).then((res) => {
      this.userInfo = res.data.profile;
    });
    this.axios({
      method: "get",
      url: "/user/level?cookie=" + encodeURIComponent(this.$store.state.cookie),
    })
      .then((res) => {
        this.levelInfo = res.data.data;
      })
      .catch((err) => {
        window.console.log(err);
      });
  },
};
</script>

<style>
</style>