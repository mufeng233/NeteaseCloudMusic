<template>
  <v-row class="login-cellphone" style="height: 80vh" justify="center">
    <v-col cols="10" sm="6" lg="4" align-self="center">
      <v-form v-model="loginForm" lazy-validation>
        <v-card :loading="loading">
          <v-card-title primary-title>登录 </v-card-title>
          <v-card-subtitle
            >登录即可使用MaterialDesign风格的网易云音乐</v-card-subtitle
          >
          <v-card-text>
            <v-text-field
              label="手机号"
              prepend-icon="mdi-account"
              v-model="phoneNumber"
              type="number"
              clearable
              required
            ></v-text-field>
            <v-text-field
              label="密码"
              prepend-icon="mdi-onepassword"
              type="password"
              v-model="password"
              clearable
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="policyDialog = true">
              隐私政策
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              @click.prevent="submit"
              :disabled="loading"
              raised
              >登录
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
    <v-dialog
      v-model="policyDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="policyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>隐私政策</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="my-2"
          ><div class="title">关于保护用户信息</div>
          <p>
            我们使用网易云音乐官方接口进行登录操作，并对密码通过md5加密，所以谁都不知道密码，更不会盗窃您的一切用户信息。
          </p>
          <div class="title">我们如何使用COOKIES</div>
          <p>
            通过使用COOKIES，我们向用户提供简单易行并富个性化的网络体验。一个COOKIES是少量的数据，它们从一个网络服务器送至您的浏览器并存在计算机硬盘上。我们使用COOKIES是为了让其用户可以受益。比如，为使得网易云音乐的登录过程更快捷，您可以选择把用户名存在一个COOKIES中。这样下次当您要登录网易云音乐的服务时能更加方便快捷。COOKIES能帮助我们确定您连接的页面和内容，您在网易云音乐上花费的时间和您所选择的网易云音乐页面。
          </p>
          <p>
            您可以通过浏览器或用户选择机制拒绝或管理COOKIES。但请您注意，如果您停用COOKIES，我们有可能无法为您提供最佳的服务体验，某些服务也可能无法正常使用。
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "login-cellphone",
  data() {
    return {
      loginForm: "",
      phoneNumber: "",
      password: "",
      loading: false,
      policyDialog: false,
    };
  },
  methods: {
    submit() {
      if (this.phoneNumber && this.password) {
        this.loading = true;
        this.axios({
          method: "get",
          url:
            "/login/cellphone?phone=" +
            encodeURIComponent(this.phoneNumber) +
            "&password=" +
            encodeURIComponent(this.password),
        })
          .then((res) => {
            switch (res.data.code) {
              case 200:
                this.$dialog.notify.success("登录成功", {
                  position: "top-right",
                  timeout: 2000,
                });
                window.localStorage.setItem("cookie", res.data.cookie);
                // this.$cookies.set("cookie", res.data.cookie, "5d");
                setTimeout(() => {
                  location.reload();
                }, 1000);
                break;
              case 502:
                this.$dialog.notify.error("密码错误", {
                  position: "top-right",
                  timeout: 2000,
                });
                break;
              case 400:
                this.$dialog.notify.error("请输入正确的手机号", {
                  position: "top-right",
                  timeout: 2000,
                });
                break;
              default:
                this.$dialog.notify.error("未知错误", {
                  position: "top-right",
                  timeout: 2000,
                });
                break;
            }
            this.loading = false;
          })
          .catch((err) => {
            this.$dialog.notify.error("未知错误", {
              position: "top-right",
              timeout: 2000,
            });
            this.loading = false;
            window.console.log(err);
          });
      } else {
        this.$dialog.notify.error("请输入完整", {
          position: "top-right",
          timeout: 2000,
        });
      }
    },
  },
};
</script>