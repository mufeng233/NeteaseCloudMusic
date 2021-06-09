<template>
  <div class="message-notices">
    <v-row v-if="notices">
      <v-col cols="12">
        <v-card
          class="mx-auto my-4"
          shaped
          max-width="400"
          v-for="(item, key) in notices"
          :key="'notice' + key"
        >
          <v-card-title>
            <v-icon left> mdi-chat </v-icon>
            <span class="title">通知</span>
          </v-card-title>

          <v-card-actions>
            <v-list-item :to="'/user/home/' + item.user.userId">
              <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="item.user.avatarUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.user.nickname }}
                    <v-list-item-subtitle>
                        {{ item.generalNotice.actionDesc }}
                    </v-list-item-subtitle>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>

          <v-card-text class="text-body-1">=
            <v-banner
              class="ma-3 grey lighten-3"
              elevation="1"
              icon="mdi-music"
              rounded
              single-line
            >
                {{ item.generalNotice.content }}
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
  name: "message-notices",
  data() {
    return {
      notices: null,
    };
  },
  created() {
    this.axios({
      method: "get",
      url:
        "/msg/notices?timestamp=" +
        Date.now() +
        "&cookie=" +
        encodeURIComponent(this.$store.state.cookie),
    })
      .then((res) => {
        let arr = [];
        let obj = res.data.notices;
        for (let item in obj) {
          arr.push(JSON.parse(obj[item].notice));
        }
        this.notices = arr;
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>