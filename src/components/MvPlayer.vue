<template>
  <div class="mv-player">
    <v-row v-if="mvInfo && mvCount && config.url">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-responsive>
              <xgplayer :config="config" @player="Player = $event" />
            </v-responsive>
          </v-card-text>
          <v-card-actions class="pr-8">
            <v-spacer></v-spacer>
            <v-badge
              class="mr-2"
              :content="$formatCount(mvCount.likedCount)"
              bordered
              overlap
            >
              <v-btn icon>
                <v-icon :color="mvCount.liked ? 'primary' : 'grey darken-1'"
                  >mdi-thumb-up</v-icon
                >
              </v-btn>
            </v-badge>
            <v-badge
              class="mr-2"
              :content="$formatCount(mvCount.shareCount)"
              bordered
              overlap
            >
              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-badge>
            <v-badge
              class="mr-2"
              :content="$formatCount(mvCount.commentCount)"
              bordered
              overlap
            >
              <v-btn icon>
                <v-icon>mdi-comment</v-icon>
              </v-btn>
            </v-badge>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-card v-else>
      <v-skeleton-loader type="image,article"></v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import Xgplayer from "xgplayer-vue";

export default {
  name: "mv-player",
  data() {
    return {
      config: {
        id: "vs",
        url: null,
        fluid: true,
        autoplay: true,
        loop: true,
        poster: null,
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
        defaultPlaybackRate: 1,
        keyShortcut: 'on',
        errorTips: `请<span>刷新</span>试试`
      },
      Player: null,
      mvInfo: null,
      mvCount: null,
    };
  },
  method: {},
  created() {
    let mvId = this.$route.query.id;
    if (!mvId) {
      this.$router.push("/404");
    } else {
      this.axios({
        method: "get",
        url:
          "/mv/detail/?mvid=" +
          mvId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (res.data.data) {
            this.mvInfo = res.data.data;
            this.config.poster = res.data.data.cover;
            document.title = this.mvInfo.name + " - " + document.title;
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
          "/mv/url/?id=" +
          mvId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.config.url = res.data.data.url;
        })
        .catch((err) => {
          window.console.error(err);
        });
      this.axios({
        method: "get",
        url:
          "/mv/detail/info?mvid=" +
          mvId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.mvCount = res.data;
        })
        .catch((err) => {
          window.console.error(err);
        });
    }
  },
  components: {
    Xgplayer,
  },
};
</script>

<style>
</style>