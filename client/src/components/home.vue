<template>
  <div>
    <div>
      <div>
        <div v-if="this.$store.getters.page === 0">
          <div>
            Welcome {{ this.$store.getters.user }}!
          </div>
          <div>{{ now }}</div>
        </div>
        <div>
          <div>
            Upload
            <form
              enctype="multipart/form-data"
              novalidate
              v-if="start || saved"
            >
              <h1>Upload Files</h1>
              <img
                src="../assets/recycling-bin.png"
                width="35"
                height="35"
                v-on:click="remove('all')"
              />
              <div>
                <input
                  type="file"
                  multiple
                  :name="uploadFieldName"
                  :disabled="saved"
                  @change="
                    newFile($event.target.name, $event.target.files);
                    fileCount = $event.target.files.length;
                  "
                />
                <p v-if="start">Choose File to Upload<br /></p>
                <p v-if="saved">Processing {{ fileCount }} files...</p>
              </div>
            </form>

            <div v-if="sucess">
              <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
              <p>
                <a href="javascript:void(0)" @click="reset()">Upload again</a>
              </p>
              <ul>
                <li v-bind:key="item" v-for="item in uploadedFiles">
                  <p>{{ item.url }}</p>
                  <img :src="item.url" :alt="item.originalName" />
                </li>
              </ul>
            </div>

            <div v-if="fail">
              <h2>Uploaded failed.</h2>
              <p>
                <a href="javascript:void(0)" @click="reset()">Try again</a>
              </p>
              <pre>{{ error }}</pre>
            </div>
          </div>
        </div>
      </div>
      <i></i>
    </div>
    <h1>Recent Files</h1>
    <div>
      <p
        v-for="(file, index) in this.$store.getters.uploads"
        v-bind:item="file"
        v-bind:index="index"
        v-bind:key="file._id"
      >
        <b>File: </b>{{ file._id }} <b>Size: </b>{{ file.fileSize / 1000 }}KB

        <b>Type: </b>{{ file.fileType }} <b>Uploaded By: </b>{{ file.user }}
      </p>
    </div>
  </div>
</template>

<script>
import UploadService from "../services/uploadService";
export default {
  name: "homeComponet",
  data() {
    return {
      uploadedFiles: [],
      error: null,
      currentStatus: null,
      uploadFieldName: "file",
      now: new Date()
    };
  },
  created() {
    UploadService.getFiles(this.$store.getters.user)
      .then(x => {
        this.$store.commit("changeFiles", x);
        setInterval(() => {
          this.now = new Date();
        }, 1000);
      })
      .catch(err => {
        this.error = err;
        this.currentStatus = 3;
      });
  },
  computed: {
    start() {
      return this.currentStatus === 0;
    },
    saved() {
      return this.currentStatus === 1;
    },
    sucess() {
      return this.currentStatus === 2;
    },
    fail() {
      return this.currentStatus === 3;
    }
  },
  methods: {
    remove(id) {
      if (confirm(id === "all" ? "Delete all files?" : "Delete file: " + id)) {
        UploadService.remove(id, this.$store.getters.user);
      } else {
        return;
      }
    },
    reset() {
      this.currentStatus = 0;
      this.uploadedFiles = [];
      this.error = null;
    },
    save(formData) {
      this.currentStatus = 1;
      UploadService.upload(formData, this.$store.getters.user)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = 2;
        })
        .catch(err => {
          if (err.response.status === 400)
            this.error = "400 | Filetype not allowed";
          if (err.response.status === 409)
            this.error = "409 | File already exists.";
          else this.error = err;
          this.currentStatus = 3;
        });
    },
    newFile(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });

      this.save(formData);
    },
    async changePage(page) {
      if (page === 0) {
        await UploadService.getFiles(this.$store.getters.user).then(x => {
          this.$store.commit("changeFiles", x);
        });
      }
      this.$store.commit("changePage", page);
    },
    logout() {
      this.$store.commit("changeUser", null);
      this.$router.push("/login");
    }
  },
  mounted() {
    this.reset();
  }
};
</script>
