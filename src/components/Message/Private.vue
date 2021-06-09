<template>
  <div class="message-private">
    <v-row v-if="messages">
      <v-col cols="12">
        <v-list three-line>
          <v-list-item-group>
            <template v-for="(item, key) in messages">
              <v-list-item
                :key="'message-private' + key"
                :to="'/chat?id=' + item.fromUser.userId"
              >
                <v-badge
                  v-if="item.fromUser.avatarDetail"
                  color="red"
                  avatar
                  bordered
                  bottom
                  overlap
                  offset-x="30"
                  offset-y="30"
                >
                  <template v-slot:badge>
                    <v-avatar>
                      <v-img
                        :src="item.fromUser.avatarDetail.identityIconUrl"
                      ></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-avatar class="ml-0" size="50">
                    <v-img
                      :lazy-src="item.fromUser.avatarUrl"
                      :src="item.fromUser.avatarUrl"
                    ></v-img>
                  </v-list-item-avatar>
                </v-badge>
                <v-list-item-avatar v-else class="ml-0" size="50">
                  <v-img
                    :lazy-src="item.fromUser.avatarUrl"
                    :src="item.fromUser.avatarUrl"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="accent--text">
                    {{ item.fromUser.nickname }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ JSON.parse(item.lastMsg).msg }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>{{ $formatTime(item.lastMsgTime) }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="key < messages.length - 1"
                :key="key"
                inset
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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
  name: "message-private",
  data() {
    return {
      messages: null,
    };
  },
  created() {
    this.axios({
      method: "get",
      url:
        "/msg/private?timestamp=" +
        Date.now() +
        "&cookie=" +
        encodeURIComponent(this.$store.state.cookie),
    })
      .then((res) => {
        this.messages = res.data.msgs;
      })
      .catch((err) => {
        window.console.error(err);
      });
  },
};
</script>

<style>
</style>