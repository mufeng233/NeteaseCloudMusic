<template>
  <div class="search-index">
    <v-row class="d-flex justify-center" v-if="showKeyword">
      <v-col cols="10" sm="8" lg="6" align-self="center">
        <v-autocomplete
          solo
          :placeholder="showKeyword"
          :items="searchSuggestion"
          hide-no-data
          hide-details
          v-model="searchContent"
          @update:search-input="changeSearchContent"
          @change="changeSearchResult"
          clearable
          autofocus
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" v-if="searchResult">
        <v-list subheader two-line flat>
          <v-subheader
            >搜索结果（{{ searchResult.songCount }}条结果）</v-subheader
          >
          <v-list-item-group>
            <v-list-item
              v-for="(item, key) in searchResult.songs"
              :key="'searchResult' + key"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span
                    v-for="(item, key) in item.artists"
                    :key="'artists' + key"
                  >
                    {{ item.name }}&nbsp;
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
        </v-list>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-skeleton-loader type="card,paragraph"></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      showKeyword: null,
      searchContent: null,
      searchResult: null,
      searchSuggestion: [],
    };
  },
  methods: {
    changeSearchContent(val) {
      if (val) {
        this.axios({
          method: "get",
          url: "/search/suggest?type=mobile&keywords=" + val,
        })
          .then((res) => {
            if (res.data.code == 200) {
              let arr = [];
              let obj = res.data.result.allMatch;
              for (let item in obj) {
                arr.push(obj[item].keyword);
              }
              this.searchSuggestion = arr;
            } else {
              // this.$router.push("/404");
            }
          })
          .catch((err) => {
            window.console.error(err);
          });
      }
    },
    changeSearchResult() {
      if (this.searchContent) {
        this.axios({
          method: "get",
          url: "/search?keywords=" + this.searchContent,
        })
          .then((res) => {
            if (res.data.code == 200) {
              this.searchResult = res.data.result;
            } else {
              // this.$router.push("/404");
            }
          })
          .catch((err) => {
            window.console.error(err);
          });
      } else {
        this.searchResult = null;
      }
    },
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    let searchContent = this.$route.query.q;
    this.axios({
      method: "get",
      url: "/search/default",
    })
      .then((res) => {
        if (res.data.code == 200) {
          this.showKeyword = res.data.data.showKeyword;
        } else {
          this.$router.push("/404");
        }
      })
      .catch((err) => {
        window.console.error(err);
      });
    this.axios({
      method: "get",
      url: "/search/hot",
    })
      .then((res) => {
        if (res.data.code == 200) {
          let arr = [];
          let obj = res.data.result.hots;
          for (let item in obj) {
            arr.push(obj[item].first);
          }
          this.searchSuggestion = arr;
        } else {
          this.$router.push("/404");
        }
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>