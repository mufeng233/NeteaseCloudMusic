<template>
  <v-card
    style="text-align: center"
    :flat="flat == undefined || flat == false ? false : true"
  >
    <v-card-text>
      
      <!-- <div class="lyric">
        <div v-for="(item, key) in lyric.lines" :key="'item.txt' + key">
          <v-expand-transition>
            <p class="primary--text text-h6" v-if="lyric.curNum == key + 1">
              {{ item.txt }}
            </p>
          </v-expand-transition>
          <p class="grey--text" v-if="lyric.curNum < key + 1">
            {{ item.txt }}
          </p>
        </div>
      </div> -->

      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.native="playing ? pause() : play()"
        :disabled="!loaded"
      >
        <v-icon v-if="!playing || paused">mdi-play</v-icon>
        <v-icon v-else>mdi-pause</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.native="stop()"
        :disabled="!loaded"
      >
        <v-icon>mdi-stop</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.native="mute()"
        :disabled="!loaded"
      >
        <v-icon v-if="!isMuted">mdi-volume-high</v-icon>
        <v-icon v-else>mdi-volume-mute</v-icon>
      </v-btn>
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
      <v-progress-linear
        class="my-4"
        v-model="percentage"
        height="5"
        :disabled="!loaded"
        rounded
      ></v-progress-linear>
      <p>{{ currentTime }} / {{ duration }}</p>
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
  name: "vuetify-audio",
  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    file: {
      type: String,
      default: null,
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
    lyric: {
      type: Object,
      default: null,
    },
  },
  computed: {
    duration: function () {
      return this.audio ? formatTime(this.totalDuration) : "";
    },
  },
  data() {
    return {
      firstPlay: true,
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: "00:00:00",
      audio: undefined,
      totalDuration: 0,
    };
  },

  methods: {
    setPosition() {
      // this.audio.currentTime = parseInt(
      //   (this.audio.duration / 100) * this.percentage
      // );
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
  },
  mounted() {
    this.audio = this.$refs.player;
    this.init();
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

<style scoped>
.lyric {
  overflow: hidden;
  height: 150px;
  overflow-x: hidden;
}
</style>
