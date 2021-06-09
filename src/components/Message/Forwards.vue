<template>
  <div class="message-forwards">
    <v-row v-if="forwards">
      <v-col cols="12">
        <v-card
          class="mx-auto my-4"
          shaped
          max-width="400"
          v-for="(item, key) in forwards"
          :key="'forward' + key"
        >
          <v-card-title>
            <v-icon left> mdi-at </v-icon>
            <span class="title">信息</span>
            <v-spacer></v-spacer>
            <span class="text-body-1 grey--text">{{
              $formatTime(item.showTime)
            }}</span>
          </v-card-title>

          <v-card-actions>
            <v-list-item :to="'/user/home/' + item.user.userId">
              <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="item.user.avatarUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.user.nickname }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>

          <v-card-text class="text-body-1">
            {{ JSON.parse(item.json).msg }}
            <v-banner
              class="ma-3 grey lighten-3"
              elevation="1"
              icon="mdi-music"
              rounded
              single-line
            >
              <router-link :to="'/song?id=' + JSON.parse(item.json).song.id">
                {{ JSON.parse(item.json).song.name }}
              </router-link>
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
  name: "message-forwards",
  data() {
    return {
      forwards: null,
    };
  },
  created() {
    this.axios({
      method: "get",
      url:
        "/msg/forwards?timestamp=" +
        Date.now() +
        "&cookie=" +
        encodeURIComponent(this.$store.state.cookie),
    })
      .then((res) => {
        let arr = [];
        let obj = res.data.forwards;
        for (let item in obj) {
          arr.push(JSON.parse(obj[item].json));
        }
        this.forwards = arr;
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>