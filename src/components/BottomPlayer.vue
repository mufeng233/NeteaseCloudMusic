<template>
  <div class="bottom-player">
    <v-bottom-sheet v-if="$store.getters.isLogin" hide-overlay inset>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="bottomPlayerFab"
          color="primary"
          fab
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-motion-play</v-icon>
        </v-btn>
      </template>
      <v-card tile>
        <bottom-player-content
          :canPlay="canPlay"
          :ended="ended"
          autoPlay
          flat
        ></bottom-player-content>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import BottomPlayerContent from "./BottomPlayerContent";

export default {
  name: "bottom-player",
  data() {
    return {
    };
  },
  methods: {
    ended() {},
    canPlay() {},
  },
  created() {

  },
  components: {
    BottomPlayerContent,
  },
};
</script>

<style>
.bottomPlayerFab {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 0 20px 100px 0;
}
</style>