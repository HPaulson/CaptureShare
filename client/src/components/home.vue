<template>
  <div id="app">
    <div class="container">
    <div class="body">

    <div class="grid-container" id="page0" v-if="this.$store.getters.page === 0">
       <div class="menu-icon">
        <i class="fas fa-bars header__menu"></i>
       </div>
   <header class="header">
    <div class="header__search"></div>
    <div class="header__avatar"></div>
  </header>
  

  <aside class="sidenav">
    <div class="sidenav__close-icon">
      <i class="fas fa-times sidenav__brand-close"></i>
    </div>
    <ul class="sidenav__list">
      <li class="sidenav__list-item"><a @click="logout">Logout</a></li>
    </ul>
  </aside>

  <main class="main">
    <div class="main-header">
      <div class="main-header__heading">Welcome {{ this.$store.getters.user }}!</div>
      <div class="main-header__updates">{{ now }}</div>
    </div>
    <div class="main-cards">
      <div style="width: 100%" class="card">Upload
              <form enctype="multipart/form-data" novalidate v-if="start || saved" class="uploadwrapper">
        <h1>Upload Files</h1>
              <img
        style="position:relative; top:10px;"
        src="../assets/recycling-bin.png"
        width="35"
        height="35"
        v-on:click="remove('all')"
      />
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="saved"
            @change="
              newFile($event.target.name, $event.target.files);
              fileCount = $event.target.files.length;
            "
            class="input-file"
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
        <ul class="list-unstyled">
          <li v-bind:key="item" v-for="item in uploadedFiles">
            <p>{{ item.url }}</p>
            <img :src="item.url" class="img" :alt="item.originalName" />
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
      <i class="fas fa-upload" style="vertical-align: middle;"></i> 
      </div>
      <h1>Recent Files</h1>
  <div class="uploads-container">
    <p class = "card"
      v-for="(file, index) in this.$store.getters.uploads"
      v-bind:item="file"
      v-bind:index="index"
      v-bind:key="file._id"
      >
    <b>File: </b>{{file._id}}                    <b>Size: </b>{{file.fileSize / 1000}}KB

    <b>Type: </b>{{file.fileType}}                    <b>Uploaded By: </b>{{file.user}}</p>
    </div>
  <footer class="footer">
    <div class="footer__copyright"></div>
    <div class="footer__signature"></div>
  </footer>
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
      created () {
   UploadService.getFiles(this.$store.getters.user)
          .then((x) => {
            this.$store.commit('changeFiles', x)
            setInterval(() => {this.now = new Date}, 1000)
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
       await UploadService.getFiles(this.$store.getters.user)
          .then(x => {
            this.$store.commit('changeFiles', x)
          })}
      this.$store.commit('changePage', page)
    },
    logout() {
      this.$store.commit('changeUser', null)
      this.$router.push('/login');
    }
    },
    mounted() {
      this.reset();
    },
  }
</script>

<style>

:root {
  --page-content-txtColor: #171616;
  --page-content-blockColor: #fff;
  --white: #fff;
  --black: #333;
  --blue: #00b9eb;
  --red: #ec1848;
  --border-radius: 4px;
  --box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.075);
}

#upload {
  position: absolute; 
            margin: auto; 
            top: 0; 
            left: 0; 
            right: 0; 
            bottom: 0; 
}

h1 {
  text-align: center;
}

/*
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
} */
/*
.input-file {
  opacity: 0;
  position: absolute;
}

.dropbox:hover {
  background: lightblue;
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
} */

body {
  margin: 0;
  padding: 0;
  color: #fff;
  font-family: 'Open Sans', Helvetica, sans-serif;
  box-sizing: border-box;
  background-color: #444444;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
  grid-template-areas:
    'header'
    'main'
    'footer';
}

.menu-icon {
  position: fixed;
  display: flex;
  top: 5px;
  left: 10px;
  align-items: center;
  justify-content: center;
  background-color: #DADAE3;
  border-radius: 50%;
  z-index: 1;
  cursor: pointer;
  padding: 12px;
}

.header {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #444444;
}

.header__search {
  margin-left: 42px;
}

.sidenav {
  grid-area: sidenav;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 240px;
  position: fixed;
  overflow-y: auto;
  transform: translateX(-245px);
  transition: all .6s ease-in-out;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  z-index: 2;
  background-color: #383838;
}

.sidenav.active {
  transform: translateX(0);
}

.sidenav__close-icon {
  position: absolute;
  visibility: visible;
  top: 8px;
  right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: #ddd;
}

.sidenav__list {
  padding: 0;
  margin-top: 85px;
  list-style-type: none;
}

.sidenav__list-item {
  padding: 20px 20px 20px 40px;
  color: #ddd;
}

.sidenav__list-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.main {
  grid-area: main;
  background-color: #444444;
}

.main-header {
  display: flex;
  justify-content: space-between;
  margin: 20px;
  padding: 20px;
  height: 150px;
  background-color: #383838;
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.main-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
  grid-auto-rows: 94px;
  grid-gap: 20px;
  margin: 20px;
}

.overviewcard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #d3d3;
}

.main-cards {
  column-count: 1;
  column-gap: 20px;
  margin: 20px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #444444;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}
</style>
