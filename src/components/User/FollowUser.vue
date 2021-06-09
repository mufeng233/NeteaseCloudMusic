<template>
  <div class="user-followUser">
    <v-fab-transition>
      <v-btn
        v-show="
          myInfo.userId != userInfo.profile.userId && !userInfo.profile.followed
        "
        @click="followUser(1)"
        :loading="followLoading"
        color="accent"
        fab
        dark
        absolute
        bottom
        right
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-fab-transition>
      <v-btn
        v-show="
          myInfo.userId != userInfo.profile.userId && userInfo.profile.followed
        "
        @click="followUser(0)"
        :loading="followLoading"
        color="secondary"
        fab
        dark
        absolute
        bottom
        right
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
export default {
  name: "user-followUser",
  data() {
    return {
      followLoading:false
    }
  },
  methods: {
    followUser(type) {
      this.followLoading = true;
      this.axios({
        method: "get",
        url:
          `/follow?t=${type}&id=` +
          this.userInfo.profile.userId +
          `&timestamp=${Date.now()}` +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          let code = res.data.code;
          switch (code) {
            case 200:
              if (res.data.py) {
                this.axios({
                  method: "get",
                  url:
                    "/user/detail?uid=" +
                    this.userInfo.profile.userId +
                    "&timestamp=" +
                    Date.now() +
                    "&cookie=" +
                    encodeURIComponent(this.$store.state.cookie),
                })
                  .then((res) => {
                    if (res.status != 404) {
                      this.userInfo = res.data;
                    } else {
                      this.$router.push("/404");
                    }
                  })
                  .catch((err) => {
                    this.$router.push("/404");
                    window.console.error(err);
                  });
                this.$dialog.message.info(res.data.followContent, {
                  position: "bottom",
                  timeout: 2000,
                });
              } else {
                this.axios({
                  method: "get",
                  url:
                    "/user/detail?uid=" +
                    this.userInfo.profile.userId +
                    "&timestamp=" +
                    Date.now() +
                    "&cookie=" +
                    encodeURIComponent(this.$store.state.cookie),
                })
                  .then((res) => {
                    if (res.status != 404) {
                      this.userInfo = res.data;
                    } else {
                      this.$router.push("/404");
                    }
                  })
                  .catch((err) => {
                    window.console.error(err);
                  });
                this.$dialog.message.info("取关成功", {
                  position: "bottom",
                  timeout: 1000,
                });
              }
              break;
            
            case 201:
              this.$dialog.message.error('没有关注',{
                position:'bottom',
                timeout:1000,
              })
              break;

            default:
              this.$dialog.message.error("未知错误！", {
                position: "bottom",
                timeout: 1000,
              });
              break;
          }
          this.followLoading = false;
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
  },
  props:{
    myInfo:Object,
    userInfo:Object,
  }
};
</script>

<style>
</style>