<template>
  <div class="messgae-MsgBox">
    <v-row v-if="msgs && myInfo">
      <v-col cols="12">
        <v-btn class="ma-2" color="primary" @click="$router.go(-1)" outlined>
          <v-icon>mdi-arrow-left</v-icon> 返回
        </v-btn>
        <div class="lite-chatbox mb-15">
          <div v-for="(item, key) in msgs" :key="'msg' + key">
            <div
              class="cmsg"
              :class="{
                cleft: item.fromUser.userId != myInfo.userId,
                cright: item.fromUser.userId == myInfo.userId,
              }"
            >
              <img class="headIcon radius" :src="item.fromUser.avatarUrl" />
              <span class="name">{{ item.fromUser.nickname }}</span>
              <span class="content">{{ JSON.parse(item.msg).msg }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-skeleton-loader type="card,article,card,article"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-form>
      <div class="input-box">
        <v-textarea
          class="mr-3"
          v-model="sendMsgContent"
          solo
          placeholder="请输入消息"
          rows="1"
          clearable
          clear-icon="mdi-delete"
          required
        >
        </v-textarea>
        <v-btn
          class="mb-7"
          color="primary"
          :loading="loading"
          @click="sendMsg(sendMsgContent)"
          large
        >
          发送
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "messgae-MsgBox",
  data() {
    return {
      msgs: null,
      loading:false,
      sendMsgContent: null,
      myInfo: null,
    };
  },
  methods: {
    getMsg(userId) {
      this.axios({
        method: "get",
        url:
          "/msg/private/history?uid=" +
          userId +
          "&timestamp=" +
          Date.now() +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          this.msgs = res.data.msgs.reverse();
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    sendMsg(msg) {
      let userId = this.$route.query.id;
      if (msg) {
        this.loading = true;
        this.axios({
          method: "get",
          url:
            "/send/text?user_ids=" +
            userId +
            "&msg=" +
            msg +
            "&timestamp=" +
            Date.now() +
            "&cookie=" +
            encodeURIComponent(this.$store.state.cookie),
        })
          .then((res) => {
            this.loading = false;
            this.sendMsgContent = null;
            this.msgs = res.data.newMsgs.reverse();
          })
          .catch((err) => {
            window.console.error(err);
          });
      } else {
        this.$dialog.message.error("内容不能为空哦！", {
          position: "top",
          timeout: 2000,
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout("window.scrollBy(0, 9999);", 1000);
    });
  },
  created() {
    let userId = this.$route.query.id;
    if (userId) {
      this.getMsg(userId);
      setInterval(() => {
        this.getMsg(userId);
      }, 5000);

      this.axios({
        method: "get",
        url:
          "/user/account?timestamp=" +
          Date.now() +
          "&cookie=" +
          encodeURIComponent(this.$store.state.cookie),
      })
        .then((res) => {
          if (userId == res.data.profile.userId) {
            this.$router.push("/404");
          } else {
            this.myInfo = res.data.profile;
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
.input-box {
  position: fixed;
  background-color: whitesmoke;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 8px 8px;
  box-sizing: border-box;
}

.input-box input {
  flex: 1;
  padding: 3px 4px;
  outline: none;
}
</style>