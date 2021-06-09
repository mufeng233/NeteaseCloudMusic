<template>
  <div class="user-index">
    <v-row v-if="myInfo && userInfo && userPlaylist">
      <v-col cols="12">
        <v-card>
          <v-img height="100%" :lazy-src="userInfo.profile.backgroundUrl">
            <v-card-title class="white--text title mt-16">
              <v-avatar size="70">
                <img alt="user" :src="userInfo.profile.avatarUrl" />
              </v-avatar>
              <span class="ml-3">
                {{ userInfo.profile.nickname }}
                <br />
                <v-badge
                  class="text-body-1"
                  color="primary"
                  rounded
                  inline
                  :content="'粉丝:' + userInfo.profile.followeds"
                >
                </v-badge>
                <v-badge
                  class="text-body-1"
                  color="primary"
                  rounded
                  inline
                  :content="'关注:' + userInfo.profile.follows"
                >
                </v-badge>
                <v-badge
                  class="text-body-1"
                  color="primary"
                  rounded
                  inline
                  :content="'等级:LV.' + userInfo.level"
                >
                </v-badge>
              </span>
            </v-card-title>
            <v-card-subtitle class="white--text"
              ><div class="text-body-1 mb-2">
                {{ $formatStr(userInfo.profile.signature) }}
              </div>
            </v-card-subtitle>
          </v-img>
          <follow-user :myInfo="myInfo" :userInfo="userInfo"></follow-user>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-subheader>歌单&收藏</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in userPlaylist"
        :key="'userPlaylist' + key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.coverImgUrl"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title class="white--text">{{ item.name }}</v-card-title>
            <v-card-subtitle class="white--text">{{
              item.copywriter
            }}</v-card-subtitle>
          </v-img>

          <v-card-text class="d-flex align-center">
            播放{{ $formatCount(item.playCount) }}次
            <v-spacer></v-spacer>
            <v-btn :to="'/playlist/?id=' + item.id" icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-skeleton-loader type="card,article,card,article"></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FollowUser from "./FollowUser";

export default {
  name: "user-index",
  data() {
    return {
      myInfo: null,
      userInfo: null,
      userPlaylist: null,
    };
  },
  created() {
    let userId = this.$route.params.id;
    if (userId) {
      this.axios({
        method: "get",
        url:
          "/user/detail?uid=" +
          userId +
          "&timestamp=" +
          Date.now() +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (res.status != 404) {
            this.userInfo = res.data;
            document.title =
              this.userInfo.profile.nickname + " - " + document.title;
          } else {
            this.$router.push("/404");
          }
        })
        .catch((err) => {
          this.$router.push("/404");
          window.console.error(err);
        });
      this.axios({
        method: "get",
        url:
          "/user/playlist?uid=" +
          userId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (res.data.playlist[0]) {
            this.userPlaylist = res.data.playlist;
          } else {
            this.$router.push("/404");
          }
        })
        .catch((err) => {
          window.console.error(err);
        });
      this.axios({
        method: "get",
        url:
          "/user/account?timestamp=" +
          Date.now() +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.myInfo = res.data.profile;
        })
        .catch((err) => {
          window.console.error(err);
        });
    } else {
      this.$router.push("/404");
    }
  },
  components: {
    FollowUser,
  },
};
</script>

<style>
</style>