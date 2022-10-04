<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-content>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                  <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>S'identifier</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :href="source"
                        icon
                        large
                        target="_blank"
                        v-on="on"
                      >
                        <v-icon>mdi-code-tags</v-icon>
                      </v-btn>
                    </template>
                    <span>Source</span>
                  </v-tooltip> -->
                  </v-toolbar>
                  <v-card-text>
                    <v-form
                      class="input--fields__wrapper"
                      ref="form"
                      v-model="isValidLog"
                      lazy-validation
                      v-on:submit.prevent="submitLogin"
                    >
                      <v-text-field
                        @keyup.enter="actionLogin"
                        :rules="[rules.required]"
                        v-model="emailLogin"
                        label="Login"
                        name="login"
                        prepend-icon="person"
                        type="text"
                      ></v-text-field>

                      <v-text-field
                        @keyup.enter="actionLogin"
                        v-model="PasswordLogin"
                        :rules="[rules.required]"
                        id="password"
                        label="Password"
                        name="password"
                        prepend-icon="lock"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loading"
                      @click="submitLogin"
                      color="primary"
                      >Login</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
      </v-app>
    </v-app>
  </div>
</template>

<script>
export default {
  name: `Home`,
  data: () => ({
    rules: {
      required: (value) => !!value || 'Ce champ est obligatoire.',
      min: (v) =>
        v.length >= 8 || 'Le champ doit contenir 8 caractères minimum',
      emailRules: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'Veuillez entrer une adresse électronique valide',
    },

    emailLogin: '',
    PasswordLogin: '',
    Checker: false,

    formErrors: [],
    maxChars: 10,

    loading: false,
    rloading: false,
  }),

  computed: {
    
    auth_error() {
      return this.$store.state.frontend.status;
    },
    stuff() {
      return this.$store.state.loginstore.test;
    },
    user() {
      return this.$store.state.loginstore.user;
    },
    auth_statusCheck() {
      return this.$store.mutation.auth_status;
    },
    passwordConfirmationRule() {
      return () =>
        this.password === this.repeatPassword ||
        'Les mots de passe saisis ne sont pas identiques';
    },
  },
  created() {
    this.checkRendering();
  },
  methods: {
    actionLogin(event) {
      if (event.keyCode === 13) {
        this.submitLogin();
      }
    },
    checkRendering() {
      this.$store.state.sdrawer.toRender = false;
    },

    submitLogin() {
      if (this.$refs.form.validate()) {
        let userlogin = {
          email: this.emailLogin,
          password: this.PasswordLogin,
        };
        (this.loading = true),
          this.$store
            .dispatch('loginstore/login', userlogin)
            .then(() => {
              this.loading = false;
              if(this.user.role ==='bov') {
                this.$router.push('/Nouveau-dossier');

              }
              else {
              this.$router.push('/Nouveaux-Documents');
              }
            })
            .catch((err) => {
              this.loading = false;
            });
      }
    },
  },
};
</script>
