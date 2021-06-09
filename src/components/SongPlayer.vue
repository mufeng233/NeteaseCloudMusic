<template>
  <div class="song-player">
    <v-row v-if="songInfo && lyric">
      <v-col>
        <v-card class="text-center">
          <div>
            <div class="text-h4 pa-5">
              {{ songInfo.name }}
            </div>
            <div class="subtitle-1 grey--text" id="singers">
              <span v-for="(item, key) in songInfo.ar" :key="key"
                >{{ item.name }}
              </span>
            </div>
          </div>
          <v-avatar size="200">
            <img :src="songInfo.al.picUrl" :title="songInfo.al.name" />
          </v-avatar>
          <vuetify-audio
            :lyric="lyric"
            :file="file"
            color="primary"
            :canPlay="canPlay"
            :ended="ended"
            autoPlay
            flat
          ></vuetify-audio>
        </v-card>
      </v-col>
    </v-row>
    <v-card v-else>
      <v-skeleton-loader type="image,article"></v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import Lyric from "lyric-parser";

export default {
  name: "song-player",
  data() {
    return {
      songInfo: null,
      file: null,
      lyric: null,
      nowLrc: null,
    };
  },
  methods: {
    canPlay() {},
    ended() {},
    getLyric(songId) {
      this.axios({
        method: "get",
        url: "/lyric?id=" + songId,
      })
        .then((res) => {
          let lyric = new Lyric(res.data.lrc.lyric, this.handler);
          this.lyric = lyric;
          lyric.play();
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    handler({ lineNum, txt }) {
      window.console.log(lineNum, txt);
      this.nowLrc = txt;
    },
  } /* 
  mounted() {
    setTimeout(() => {
      let singers = document.getElementById("singers");
      let text = singers.textContent.substr(0, singers.textContent.length-1)
      singers.textContent = text
    }, 1000);
  }, */,
  created() {
    let songId = this.$route.query.id;
    if (!songId) {
      this.$router.push("/404");
    } else {
      this.getLyric(songId);
      this.axios({
        method: "get",
        url:
          "/song/detail/?ids=" +
          songId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (res.data.songs[0]) {
            this.songInfo = res.data.songs[0];
            document.title = this.songInfo.name + " - " + document.title;
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
          "/song/url/?id=" +
          songId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.file = res.data.data[0].url;
        })
        .catch((err) => {
          window.console.error(err);
        });
    }
  },
  components: {
    VuetifyAudio: () => import("./Audio.vue"),
  },
};
</script>

<style>
</style>