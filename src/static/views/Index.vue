<template>
  <div class="index">
    <v-row v-if="banners && songlists && recommend">
      <v-col cols="12">
        <v-carousel height="230" hide-delimiters cycle interval="3000">
          <v-carousel-item v-for="(banner, key) in banners" :key="'banner'+key">
            <v-img :src="banner.imageUrl" height="100%"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12">
        <v-subheader>热门推荐</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in songlists"
        :key="'songlist'+key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.picUrl"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="170px"
          >
            <v-card-title class="white--text text-body-1"><strong>{{ item.name }}</strong></v-card-title>
            <!-- <v-card-subtitle class="white--text">{{
              item.copywriter
            }}</v-card-subtitle> -->
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
      <v-col cols="12">
        <v-subheader>个性化推荐</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in recommend"
        :key="'recommend'+key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.picUrl"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="170px"
          >
            <v-card-title class="white--text text-body-1">{{ item.name }}</v-card-title>
            <v-card-subtitle class="white--text">{{
              item.copywriter
            }}</v-card-subtitle>
          </v-img>

          <v-card-text class="d-flex align-center">
            播放{{ $formatCount(item.playcount) }}次
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
export default {
  name: "index",
  data() {
    return {
      banners: null,
      songlists: null,
      recommend: null,
    };
  },
  methods: {
    getBanners() {
      this.axios({
        method: "get",
        url: "/banner",
      })
        .then((res) => {
          this.banners = res.data.banners;
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    getSonglists() {
      this.axios({
        method: "get",
        url: "/personalized",
      })
        .then((res) => {
          this.songlists = res.data.result;
        })
        .catch((err) => {
          window.console.log(err);
        });
    },
    getRecommendResource() {
      this.axios({
        method: "get",
        url:
          "/recommend/resource?cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.recommend = res.data.recommend;
        })
        .catch((err) => {
          window.console.log(err);
        });
    },
  },
  created() {
    this.getBanners();
    this.getSonglists();
    this.getRecommendResource();
  }
};
</script>

<style>
</style>