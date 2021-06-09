<template>
  <div class="message-index">
    <div v-if="userInfo">
      <v-tabs centered center-active show-arrows>
        <v-tab :to="'/message/private?id='+userInfo.userId">私信</v-tab>
        <v-tab :to="'/message/comments?id='+userInfo.userId">评论</v-tab>
        <v-tab :to="'/message/forwards?id='+userInfo.userId">@我</v-tab>
        <!-- <v-tab :to="'/message/notices?id='+userInfo.userId">通知</v-tab> -->
      </v-tabs>
      <router-view class="mt-5" :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
export default {
  name: "message-index",
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.axios({
      method: "get",
      url:
        "/user/account?cookie=" + encodeURIComponent(this.$store.state.cookie),
    }).then((res) => {
      this.userInfo = res.data.profile;
      let userId = this.$route.query.id;
      if (!userId || this.userInfo.userId != userId) {
        this.$router.push("/404");
      }
    });
  },
};
</script>

<style>
</style>