<template>
  <v-container>
    <v-row class="theContainer">
      <v-col cols="12" md="8" xl="8">
        <v-card shaped elevation="3" class=" mr-4 pl-3 pa-8" flat>
          <v-form
            class="input--fields__wrapper"
            ref="form_card"
            lazy-validation
            v-on:submit.prevent="Checkout_CARD"
          >
            <v-text-field
              @keyup.enter="cardStrokes"
              outlined
              v-model="entity"
              label="Expéditeur"
              prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              @keyup.enter="cardStrokes"
              outlined
              v-model="representative"
              label="Représentant légal"
              prepend-icon="mdi-scale-balance"
            ></v-text-field>

            <v-text-field
              @keyup.enter="cardStrokes"
              outlined
              v-model="REQemail"
              label="E-mail"
              prepend-icon="mdi-at"
            ></v-text-field>
            <div class="input--fields__container">
              <v-text-field
                @keyup.enter="cardStrokes"
                outlined
                v-model="REQfixe"
                :counter="10"
                maxLength="10"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                type="number"
                label="Téléphone fixe"
                prepend-icon="mdi-phone"
              ></v-text-field>
              <v-text-field
                @keyup.enter="cardStrokes"
                outlined
                v-model="REQmobile"
                :counter="10"
                maxLength="10"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                type="number"
                label="Téléphone mobile"
                prepend-icon="mdi-cellphone-android"
              ></v-text-field>
            </div>

            <v-textarea
              @keyup.enter="cardStrokes"
              outlined
              v-model="REQmessage"
              label="Message"
              prepend-icon="mdi-comment-text-outline"
            ></v-textarea>

            <v-select
              :rules="[rules.required]"
              :items="items"
              v-model="REQnature"
              label="Nature de demande"
              prepend-icon="mdi-pen"
              outlined
            ></v-select>

            <v-file-input
              :rules="[rules.required]"
              id="fUpload"
              multiple
              accept="application/pdf"
              outlined
              v-model="files"
              placeholder="Upload des documents"
              label="Pièces jointes"
              prepend-icon="mdi-paperclip"
            >
              <template v-slot:selection="{ text, item, selected }">
                <v-chip
                  :rules="[rules.required]"
                  :input-value="selected"
                  close
                  @click:close="remove(item)"
                  small
                  label
                  color="primary"
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <v-card-actions>
              <v-btn
                large
                class="input--fields__submit_ren"
                color="error"
                @click="reset"
              >
                <v-icon size="15" left>mdi-redo</v-icon>
                Réinitialiser
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :loading="isLoading"
                large
                class="input--fields__submit_ja"
                color="success"
                @click="onUpload"
              >
                <v-icon size="18" left>mdi-cloud-upload</v-icon>
                Envoyer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-dialog v-model="dialognew" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Message
          </v-card-title>

          <v-card-text class="title mt-5">
            {{ dialognewMessage }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialognew = false">
              Fermer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  name: `Drawer`,
  components: {},
  mounted() {
    this.$refs.form_card.reset();
    this.checkRendering();
  },
  data: () => ({
    tabs: null,
    text: "Demande d’information",
    // Suivi Stuff
    requestId: "",

    // new request beginning
    REQoverflow: false,
    entity: "",
    representative: "",
    REQemail: "",
    REQmobile: "",
    REQfixe: "",
    REQnature: "",
    REQmessage: "",
    items: [
      "Assurances",
      "Attachement",
      "Caution bancaire",
      "Caution définitive",
      "Contrats",
      "Convention",
      "Convocation Tribunal",
      "Courrier",
      "Déclaraction Assurances RH",
      "Déclaraction RCAR",
      "Expédition",
      "Facture",
      "Marchés",
      "Minute",
      "Ordre de service (OS)",
      "Plan Architecte",
      "Plans BCT",
      "Plans BET",
      "Rapport Laboratoire",
      "Rapport de mission BET",
      "Rapports d'achévement",
      "Relevés Bancaire",
      "Réclamations",
      "Réponses consultation",
    ],
    // new request data ends here
    fileSnackErr: "Invalid extension type",
    files: null,
    filesSuivi: null,
    overlay: false,
    dialognew: false,
    dialognewMessage: "",
    dialog: false,
    dialogMessage: "",
    email: undefined,
    isLoading: false,
    isLoadingSuivi: false,
    rules: {
      required: (value) => !!value || "Ce champ est obligatoire.",
      min: (v) =>
        v.length >= 8 || "Le champ doit contenir 8 caractères minimum",
      emailRules: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Veuillez entrer une adresse électronique valide",
    },
  }),

  computed: {
    emailUser() {
      return this.$store.state.user.email;
    },
    urlform() {
      return this.$store.state.urlform;
    },
    checkouterror() {
      return this.$store.state.card_error;
    },
  },

  watch: {},

  methods: {
    checkRendering() {
      this.$store.state.sdrawer.toRender = true;
    },
    extension_checker(tag) {
      const file = document.querySelector(tag);

      for (let index = 0; index < file.files.length; index++) {
        if (/\.(pdf|)$/i.test(file.files[index].name) === false) {
          //change the alert with a function that throws a snackbar or smtng
          alert("only pdf extensions ar supported");
          return false;
        } else {
          return true;
        }
      }
    },
    onUpload() {
      if (this.$refs.form_card.validate()) {
        if (this.files && this.extension_checker("#fUpload")) {
          let formData = new FormData();

          for (let file of this.files) {
            formData.append("files", file, file.name);
          }

          // initial values for other inputs

          formData.append("entity", this.entity);
          formData.append("legalRepresentative", this.representative);
          formData.append("email", this.REQemail);
          formData.append("phoneNumber", this.REQmobile);
          formData.append("landPhoneNumber", this.REQfixe);
          formData.append("requestType", this.REQnature);
          formData.append("requestMessage", this.REQmessage);

          this.isLoading = true;
          // http://192.168.1.9:3000
          axios({
            url: "/api/815QTQ6SF0RAAZA85EFF/newRequest",
            method: "POST",
            data: formData,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((response) => {
              this.isLoading = false;
              this.dialognew = true;
              this.dialognewMessage = response.data.message;
              this.reset();
            })
            .catch((error) => {
              this.isLoading = false;
              this.dialognew = true;
              this.dialognewMessage = error.response.data.message;
            });
        }
      }
    },

    reset() {
      this.$refs.form_card.reset();
    },
    resetSuivi() {
      this.$refs.form_suivi.reset();
    },
    // Key Strokes
    cardStrokes(event) {
      if (event.keyCode === 13) {
        this.Checkout_CARD();
      }
    },
  },
};
</script>
<style scoped>
.page__event--container {
  max-width: 1148px;
  width: 100%;
  margin: 0 auto;
}

.input--fields__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}

.v-card {
  border-radius: 8px;
}

@media only screen and (max-width: 375px) {
  .page__event--container {
    margin: 0 auto;
  }

  .input--fields__submit_ren {
    margin-left: 5px !important;
    padding: 0 !important;
  }
  .input--fields__submit_ja {
    margin-left: 5px !important;
  }
  .card_x {
    margin-top: 12px;
    width: 600px;
  }
  .col_card {
    margin-right: 40px;
  }
}

.v-text-field__slot input {
  text-align: left;
}

@media only screen and (device-width: 1920px) and (device-height: 1080px) {
  .v-card {
    margin-left: 20px !important;
    width: 87%;
  }
  /* .v-data-table {
    padding: 5px;
    margin-right: 150px !important;

  }  */
}

.shapedto {
  border-radius: 30px;
}

@media (min-width: 1800px) {
  .theContainer {
    padding-bottom: 2rem;
    padding-left: 10rem;
    padding-right: 9rem;
    display: flex;
  }
}
</style>
