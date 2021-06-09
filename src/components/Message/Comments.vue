<template>
  <div class="message-comments">
    <v-row v-if="comments">
      <v-col cols="12">
        <v-card
          class="mx-auto my-4"
          shaped
          max-width="400"
          v-for="(item, key) in comments"
          :key="'comment' + key"
        >
          <v-card-title>
            <v-icon left> mdi-comment-text-outline </v-icon>
            <span class="title">评论</span>
            <v-spacer></v-spacer>
            <span class="text-body-1 grey--text">{{ $formatTime(item.time) }}</span>
          </v-card-title>

          <v-card-actions>
            <v-list-item :to="'/user/home/'+item.user.userId">
              <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="item.user.avatarUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.user.nickname }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>

          <v-card-text class="text-body-1">
            {{ item.content }}
            <v-banner
              class="ma-3 grey lighten-3"
              elevation="1"
              icon="mdi-message-reply-outline"
              rounded
              single-line
            >
              {{ item.beRepliedContent }}
            </v-banner>
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
export default {
  name: "message-comments",
  data() {
    return {
      comments: null,
    };
  },
  created() {
    let userId = this.$route.query.id;
    this.axios({
      method: "get",
      url:
        "/msg/comments?uid=" +
        userId +
        "&timestamp=" +
        Date.now() +
        "&cookie=" +
        encodeURIComponent(this.$store.state.cookie),
    })
      .then((res) => {
        this.comments = res.data.comments;
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>