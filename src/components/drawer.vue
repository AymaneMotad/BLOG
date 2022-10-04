<!-- eslint-disable vue/return-in-computed-property -->
<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <v-navigation-drawer width="350" v-model="drawer" color="grey lighten-4" app>
    <template v-slot:prepend>
      <v-toolbar height="130" color="light-blue darken-4" flat>
        <v-toolbar-title class="white--text mt-12 font-weight-medium"
          >Administration</v-toolbar-title
        >
        <span class="mt-12 ml-12">
          <v-btn v-if="isLoggedIn" text x-small @click="logout" color="white">
            <v-icon size="12" left>mdi-logout</v-icon>
            <span>Deconnexion</span>
          </v-btn>
        </span>
      </v-toolbar>
    </template>

    <v-list nav>
      <div v-if="!gestionnaireChecker">
        <v-list-item
          class="mt-5"
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          exact
        >
          <v-list-item-icon class="mr-3">
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="black--text " v-text="item.text" />
          </v-list-item-content>
        </v-list-item>
      </div>

      <div v-if="gestionnaireChecker">
        <v-list-item
          class="mt-5"
          v-for="(g, i) in gestionnaire"
          :key="i"
          :to="g.to"
          exact
        >
          <v-list-item-icon class="mr-3">
            <v-icon v-text="g.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="black--text " v-text="g.text" />
          </v-list-item-content>
        </v-list-item>
      </div>
      <br />

      <div v-if="checker">
        <v-list-item v-for="(item, i) in admin" :key="i" :to="item.to" exact>
          <v-list-item-icon class="mr-3">
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="black--text " v-text="item.text" />
          </v-list-item-content>
        </v-list-item>
      </div>
      <br />
      <div v-if="assistantChecker">
        <v-list-item :to="'/Documents-affectes'" exact>
          <v-list-item-icon class="mr-3">
            <v-icon v-text="'mdi-file-check'" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              class="black--text "
              v-text="'Documents affectés'"
            />
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "drawer",
  data() {
    return {
      user: null,
      drawer: null,
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch("loginstore/logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters["loginstore/isLoggedIn"];
    },
    items() {
      return this.$store.state.sdrawer.items;
    },
    admin() {
      return this.$store.state.sdrawer.admin;
    },
    gestionnaire() {
      return this.$store.state.sdrawer.gestionnaire;
    },
    gestionnaireChecker() {
      if (this.$store.state.loginstore.user.role === "bov") {
        return true;
      }
    },
    checker() {
      if (
        this.$store.state.loginstore.user.role === "admin" ||
        this.$store.state.loginstore.user.role === "dg"
      ) {
        return true;
      }
    },
    assistantChecker() {
      if (this.$store.state.loginstore.user.role === "assistantDg") return true;
    },
  },
};
</script>

<style scoped></style>
