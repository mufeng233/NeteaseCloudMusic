<template>
  <div class="home-mv">
    <v-row v-if="recommendMvlist && firstMvlist">
      <v-col cols="12">
        <v-subheader>推荐MV</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in recommendMvlist"
        :key="'recommendMvlist' + key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.picUrl"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title class="white--text text-body-1"
              ><strong>{{ item.name }}</strong></v-card-title
            >
          </v-img>

          <v-card-text class="d-flex align-center">
            播放{{ $formatCount(item.playCount) }}次
            <v-spacer></v-spacer>
            <v-btn :to="'/mv/?id=' + item.id" icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-subheader>最新MV</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in firstMvlist"
        :key="'firstMvlist' + key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.cover"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title class="white--text text-body-1"
              ><strong>{{ item.name }}</strong></v-card-title
            >
          </v-img>

          <v-card-text class="d-flex align-center">
            播放{{ $formatCount(item.playCount) }}次
            <v-spacer></v-spacer>
            <v-btn :to="'/mv/?id=' + item.id" icon>
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
  name: "home-mv",
  data() {
    return {
      recommendMvlist: null,
      firstMvlist: null,
    };
  },
  created() {
    this.axios({
      method: "get",
      url: "/personalized/mv",
    })
      .then((res) => {
        this.recommendMvlist = res.data.result;
      })
      .catch((err) => {
        window.console.error(err);
      });
    this.axios({
      method: "get",
      url: "/mv/first?limit=10",
    })
      .then((res) => {
        this.firstMvlist = res.data.data;
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>