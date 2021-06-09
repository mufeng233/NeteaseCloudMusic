<template>
  <div class="home-top">
    <v-row v-if="toplist">
      <v-col cols="12">
        <v-subheader>音乐排行榜</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        lg="3"
        v-for="(item, key) in toplist"
        :key="'toplist' + key"
      >
        <v-card elevation="2">
          <v-img
            :src="item.coverImgUrl"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="170px"
          >
            <v-card-title class="white--text text-body-1"
              ><strong>{{ item.name }}</strong></v-card-title
            >
          </v-img>

          <v-card-text v-if="item.tracks[0]">
            <v-list two-line flat>
              <v-list-item-group>
                <v-list-item
                  v-for="(item, key) in item.tracks"
                  :key="'track' + key"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.first }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{item.second}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>

          <v-card-actions class="d-flex align-center pa-4">
            播放{{ $formatCount(item.playCount) }}次
            <v-spacer></v-spacer>
            <v-btn :to="'/playlist/?id=' + item.id" icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-card-actions>
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
  name: "home-top",
  data() {
    return {
      toplist: null,
    };
  },
  methods: {},
  created() {
    this.axios({
      method: "get",
      url: "/toplist/detail",
    })
      .then((res) => {
        this.toplist = res.data.list;
      })
      .catch((err) => {
        window.console.log(err);
      });
  },
};
</script>

<style>
</style>