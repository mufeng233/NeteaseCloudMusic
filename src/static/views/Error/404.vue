<template>
  <div class="error-404">
    <v-row class="text-center primary--text">
      <v-col cols="12">
        <div class="text-h2">404</div><br>
        <div class="text-h6">你好像走错路了，这里什么都没有。</div>
        <v-btn class="my-5" elevation="2" color="primary" raised rounded x-large to="/">
            <v-icon>mdi-keyboard-return</v-icon> 回到首页
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {};
</script>

<style>
.error-404 {
  display: flex;
  align-items: center;
  height: 60vh;
}
</style>