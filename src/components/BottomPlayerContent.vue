<template>
  <v-card
    style="text-align: center"
    :flat="flat == undefined || flat == false ? false : true"
  >
    <v-progress-linear
      v-model="percentage"
      height="5"
      :disabled="!loaded"
      @click.native="setPosition"
      rounded
    ></v-progress-linear>
    <v-card-text v-if="songInfo">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              :lazy-src="songInfo.al.picUrl"
              :src="songInfo.al.picUrl"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ songInfo.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <span v-for="(item, key) in songInfo.ar" :key="'ar' + key">
                {{ item.name }}&nbsp;
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-spacer></v-spacer>

          <!-- <v-list-item-icon>
            <v-btn icon>
              <v-icon>mdi-rewind</v-icon>
            </v-btn>
          </v-list-item-icon> -->

          <v-list-item-icon :class="{ 'mx-2': $vuetify.breakpoint.mdAndUp }">
            <v-btn
              icon
              @click.native="playing ? pause() : play()"
              :disabled="!loaded"
            >
              <v-icon v-if="!playing || paused">mdi-play</v-icon>
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon  :class="{ 'mx-2': $vuetify.breakpoint.mdAndUp }">
            <v-btn icon @click.native="stop()" :disabled="!loaded">
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon :class="{ 'mx-2': $vuetify.breakpoint.mdAndUp }">
            <v-btn icon @click.native="mute()" :disabled="!loaded">
              <v-icon v-if="!isMuted">mdi-volume-high</v-icon>
              <v-icon v-else>mdi-volume-mute</v-icon>
            </v-btn>
          </v-list-item-icon>

          <!-- <v-list-item-icon
            class="ml-0"
          >
            <v-btn icon>
              <v-icon>mdi-fast-forward</v-icon>
            </v-btn>
          </v-list-item-icon> -->
        </v-list-item>
      </v-list>

      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.native="loaded ? download() : reload()"
        v-if="!loaded"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.native="loaded ? download() : reload()"
        v-if="loaded && downloadable"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>

      <p>{{ currentTime }} / {{ duration }}</p>
    </v-card-text>
    <v-card-text v-else>
      <v-skeleton-loader type="article"></v-skeleton-loader>
    </v-card-text>
    <audio
      id="player"
      ref="player"
      v-on:ended="ended"
      v-on:canplay="canPlay"
      :src="file"
    ></audio>
  </v-card>
</template>
<script>
const formatTime = (second) =>
  new Date(second * 1000).toISOString().substr(11, 8);

export default {
  name: "bottom-player-content",
  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
    color: {
      type: String,
      default: null,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: undefined,
      firstPlay: true,
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: "00:00:00",
      audio: undefined,
      totalDuration: 0,
      songInfo: null,
      songId: null,
    };
  },

  methods: {
    setPosition() {
      this.audio.currentTime = parseInt(
        (this.audio.duration / 100) * this.percentage
      );
    },
    stop() {
      this.audio.pause();
      this.paused = true;
      this.playing = false;
      this.audio.currentTime = 0;
    },
    play() {
      if (this.playing) return;
      // eslint-disable-next-line no-unused-vars
      this.audio.play().then((_) => (this.playing = true));
      this.paused = false;
    },
    pause() {
      this.paused = !this.paused;
      this.paused ? this.audio.pause() : this.audio.play();
    },
    download() {
      this.audio.pause();
      window.open(this.file, "download");
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      this.volumeValue = this.isMuted ? 0 : 75;
    },
    reload() {
      this.audio.load();
    },
    _handleLoaded: function () {
      if (this.audio.readyState >= 2) {
        if (this.audio.duration === Infinity) {
          // Fix duration for streamed audio source or blob based
          // https://stackoverflow.com/questions/38443084/how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
          this.audio.currentTime = 1e101;
          this.audio.ontimeupdate = () => {
            this.audio.ontimeupdate = () => {};
            this.audio.currentTime = 0;
            this.totalDuration = parseInt(this.audio.duration);
            this.loaded = true;
          };
        } else {
          this.totalDuration = parseInt(this.audio.duration);
          this.loaded = true;
        }

        if (this.autoPlay) this.audio.play();
      } else {
        throw new Error("Failed to load sound file");
      }
    },
    // eslint-disable-next-line no-unused-vars
    _handlePlayingUI: function (e) {
      this.percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.currentTime = formatTime(this.audio.currentTime);
      this.playing = true;
    },
    _handlePlayPause: function (e) {
      if (e.type === "play" && this.firstPlay) {
        // in some situations, audio.currentTime is the end one on chrome
        this.audio.currentTime = 0;
        if (this.firstPlay) {
          this.firstPlay = false;
        }
      }
      if (
        e.type === "pause" &&
        this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = "00:00:00";
      }
    },
    _handleEnded() {
      this.paused = this.playing = false;
    },
    init: function () {
      this.audio.addEventListener("timeupdate", this._handlePlayingUI);
      this.audio.addEventListener("loadeddata", this._handleLoaded);
      this.audio.addEventListener("pause", this._handlePlayPause);
      this.audio.addEventListener("play", this._handlePlayPause);
      this.audio.addEventListener("ended", this._handleEnded);
    },
    getSongInfo(id) {
      this.axios
        .get("/song/detail", {
          params: {
            ids: id,
          },
        })
        .then((res) => {
          this.songInfo = res.data.songs[0];
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    getSongUrl(id) {
      this.axios
        .get("/song/url", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          this.file = res.data.data ? res.data.data[0].url : null;
        });
    },
    initSongs() {
      let songs = window.localStorage.getItem("songs");
      if (songs) {
        songs = JSON.parse(songs);
        this.songId = songs[songs.length - 1].id;
        this.getSongUrl(this.songId);
        this.getSongInfo(this.songId);
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.audio = this.$refs.player;
    this.init();
  },
  created() {
    this.initSongs();
  },
  computed: {
    duration: function () {
      return this.audio ? formatTime(this.totalDuration) : "";
    },
    isChangedSong() {
      window.console.log(JSON.parse(this.$store.getters.getLocalSongs));
      return this.$store.state.songs;
    },
  },
  watch: {
    isChangedSong() {
      window.console.log(this.isChangedSong())
      this.initSongs();
    },
  },
  beforeDestroy() {
    this.audio.removeEventListener("timeupdate", this._handlePlayingUI);
    this.audio.removeEventListener("loadeddata", this._handleLoaded);
    this.audio.removeEventListener("pause", this._handlePlayPause);
    this.audio.removeEventListener("play", this._handlePlayPause);
    this.audio.removeEventListener("ended", this._handleEnded);
  },
};
</script>