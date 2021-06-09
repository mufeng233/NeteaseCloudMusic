<template>
  <div class="playlist-index">
    <v-row v-if="playListInfo" justify="space-around">
      <v-col cols="12">
        <v-card>
          <v-img height="100%" :lazy-src="playListInfo.coverImgUrl">
            <v-card-title class="white--text mt-6">
              {{ playListInfo.name }}
              <v-icon class="float-right" color="white">mdi-play</v-icon
              >{{ $formatCount(playListInfo.playCount) }}
            </v-card-title>
            <v-card-subtitle class="white--text mt-5"
              ><div class="text-body-1 mb-2">
                {{ $formatStr(playListInfo.description) }}
              </div>
              <v-avatar size="56">
                <img alt="user" :src="playListInfo.creator.avatarUrl" />
              </v-avatar>
              <span class="title ml-3">{{
                playListInfo.creator.nickname
              }}</span>
              <div class="d-block mt-2 text-body-2" v-if="playListInfo.tags[0]">
                标签：
                <v-badge
                  v-for="(item, key) in playListInfo.tags"
                  :key="key"
                  color="primary"
                  rounded
                  inline
                  :content="item"
                >
                </v-badge>
              </div>
              <div class="d-block mt-2 text-body-2" v-else>
                歌单创建者未添加标签
              </div>
            </v-card-subtitle>
          </v-img>
          <v-card-text>
            <v-list flat>
              <v-subheader>歌曲列表</v-subheader>
              <v-virtual-scroll
                :items="playListInfo.tracks"
                height="400"
                item-height="70"
              >
                <template v-slot:default="{ index,item }">
                  <v-list-item-group>
                    <v-list-item>
                      <v-list-item-icon>
                        {{ index + 1 }}
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }} </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-for="(item, key) in item.ar" :key="key">
                            {{ item.name }}
                          </span>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn @click.once="$store.commit('addSong',item)" icon>
                          <v-icon color="grey">mdi-play</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </template>
              </v-virtual-scroll>
            </v-list>
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
  name: "playlist-index",
  data() {
    return {
      playListInfo: null,
    };
  },
  created() {
    let playListId = this.$route.query.id;
    if (playListId) {
      this.axios({
        method: "get",
        url:
          "/playlist/detail?id=" +
          playListId +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (res.data.playlist.specialType != 5) {
            this.playListInfo = res.data.playlist;
            document.title = this.playListInfo.name + " - " + document.title;
          } else {
            this.$router.push("/404");
          }
        })
        .catch((err) => {
          window.console.error(err);
        });
    } else {
      this.$router.push("/404");
    }
  },
};
</script>

<style>
</style>