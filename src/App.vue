<template>
  <v-app class="grey lighten-4">
    <v-content class="mx-4 pt-6">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
      <drawer v-if="rendered" />
    </v-content>
  </v-app>
</template>

<script>
import drawer from "@/components/drawer";
export default {
  name: "App",

  components: {
    drawer,
  },
  computed: {
    rendered() {
      return this.$store.state.sdrawer.toRender;
    },
  },

  data: () => ({
    Drawer: true,

    //
  }),
};
</script>

<style>
.v-data-footer__select {
  display: none !important;
}
</style>
