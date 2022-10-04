<template>
  <div id="app">
    <v-app id="inspire">
      <input type="text" id="ss" />
      <v-data-table
        :headers="headers"
        :items="blogItems"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Blog management</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              :persistent="persistenceTracker"
              v-model="dialog"
              max-width="500px"
              eager="true"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Add a blog
                </v-btn>
              </template>

              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-text-field
                            v-model="editedItem.blogTitle"
                            label="Blog title"
                          ></v-text-field>

                          <v-text-field
                            v-model="editedItem.blogSubtitle"
                            label="Blog subtitle"
                          ></v-text-field>

                          <v-textarea
                            v-model="editedItem.Content"
                            auto-grow
                            label="Content"
                          ></v-textarea>
                          <v-file-input
                            v-model="files"
                            id="videoUpload"
                            color="deep-purple accent-4"
                            counter
                            label="File input"
                            multiple
                            placeholder="Select your files"
                            prepend-icon="mdi-paperclip"
                            outlined
                            :show-size="1000"
                          >
                            <template v-slot:selection="{ index, text }">
                              <v-chip
                                v-if="index < 2"
                                color="deep-purple accent-4"
                                dark
                                label
                                small
                              >
                                {{ text }}
                              </v-chip>

                              <span
                                v-else-if="index === 2"
                                class="text-overline grey--text text--darken-3 mx-2"
                              >
                                +{{ files.length - 2 }} File(s)
                              </span>
                            </template>
                          </v-file-input>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-window-item>

                <v-window-item :value="2" eager="true">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Edit videos</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <div
                            id="videoContainer"
                            v-for="(file, index) in files"
                            :key="index"
                          >
                            <v-card-title
                              >Video Number #{{ index + 1 }}</v-card-title
                            >
                            <v-card-text>
                              <video
                                ref="refContainer"
                                :id="'videoPlayer' + index"
                                width="320"
                                height="240"
                                autoplay
                              >
                                <!-- <v-text-field class="mt-10 red" ></v-text-field>
<v-text-field class="mt-10 red" ></v-text-field>
Your browser does not support the video tag -->
                              </video>
                            </v-card-text>
                            <v-card-text>
                              <input
                                @change="timeTravel(index, inputStartTime)"
                                v-model="inputStartTime"
                                solo
                                :id="'startTime' + index"
                              />
                              <input
                                @change="timeTravel(index, inputEndTime)"
                                v-model="inputEndTime"
                                type="text"
                                :id="'endTime' + index"
                              />
                            </v-card-text>
                          </div>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this blog?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-app>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: `Drawer`,
  components: {},
  mounted() {
    this.$nextTick(() => {
      document.getElementById("videoUpload").onchange = (event) => {
        for (let i = 0; i < this.files.length; i++) {
          let file = this.files[i];

          let blobURL = URL.createObjectURL(file);
          this.step = 2;

          var videoUploadElement = document.getElementById("videoPlayer" + i);

          let startTime = document.getElementById("startTime" + i);
          let endTime = document.getElementById("endTime" + i);

          videoUploadElement.onloadedmetadata = function() {
            endTime.value = parseInt(videoUploadElement.duration);
          };

          videoUploadElement.src = blobURL;
        }
      };
    });
  },

  data: () => ({
    persistenceTracker: false,
    inputStartTime: 0,
    inputEndTime: null,
    dialog: false,
    dialogDelete: false,
    files: [],
    step: 1,
    headers: [
      {
        text: "Blog title",
        align: "start",
        sortable: false,
        value: "blogTitle",
      },
      { text: "Blog subtitle", value: "blogSubtitle" },
      { text: "createdAt", value: "createdAt" },

      { text: "Actions", value: "actions", sortable: false },
    ],
    blogItems: [],
    editedIndex: -1,
    editedItem: {
      blogTitle: "",
      blogSubtitle: "",
      blogContent: "",
      blogVideos: "",
      createdAt: moment(Date.now()).format("DD/MM/YYYY"),
    },
    defaultItem: {
      blogTitle: "",
      blogSubtitle: "",
      blogContent: "",
      blogVideos: "",
      createdAt: moment(Date.now()).format("DD/MM/YYYY"),
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add a new blog" : "Edit the blog";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    step(val) {
      val === 1
        ? (this.persistenceTracker = false)
        : (this.persistenceTracker = true);
    },
  },

  created() {
    this.initialize();
    this.videoLoader();
  },

  methods: {
    timeTravel(videoIndex, userInput) {
      let videoUploadElement = document.getElementById(
        "videoPlayer" + videoIndex
      );
      videoUploadElement.currentTime = userInput;
    },
    initialize() {
      this.blogItems = [
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
        {
          blogTitle: "Lorem Ipsum",
          blogSubtitle: "The subtitle",
          blogContent: "Long text Lorem Ipsum",
          blogVideos: [],
          createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.blogItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    deleteItem(item) {
      this.editedIndex = this.blogItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.blogItems.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.blogItems[this.editedIndex], this.editedItem);
      } else {
        this.blogItems.push(this.editedItem);
      }
      this.close();
      this.step = 1;
      this.files = null;
    },
  },
};
</script>
<style scoped></style>
