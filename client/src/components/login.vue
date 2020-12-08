<template>
  <main>
    <div>
            <p align="center">
                <img src="https://repository-images.githubusercontent.com/270843017/3dc7e180-c177-11ea-8238-624a2d79c255" />
            </p>
          </div>
          <div >
            <div>
              <h1>CaptureShare</h1>
              <p v-if="!message.includes(200)" style="color: red">
                {{ message }}
              </p>
              <p v-if="message.includes(200)" style="color: green">
                {{ message }}
              </p>
              <label
                ><span>Username</span>
                <form id="loginform">
                <input
                  type="text"
                  v-model="username"
                  name="username"
                  @keyup.enter="login()"
                  value=":username"
                  placeholder="Username"
                />
                <div ></div>
              </label>
              <label
                ><span >Password</span>
                <input
                  type="password"
                  v-model="password"
                  name="password"
                  @keyup.enter="login()"
                  value=":password"
                  placeholder="Password"
                />
                <div ></div>
              </label>
              <button id="submitLogin"
               v-on:click="login()" >
                Login
              </button>
              </div>
          </div>
  </main>
</template>

<script>
const loginForm = document.getElementById("loginform");
const loginButton = Document.getElementById("submitLogin");

loginButton.addEventListener("click", e => {
  e.preventDefault();
  this.username = loginForm.username.value;
  this.password = loginForm.password.value;
  this.login();
});
</script>

<script>
import LoginService from "../services/loginService";

export default {
  name: "loginComponent",
  data() {
    return {
      message: "",
      username: "",
      password: ""
    };
  },
  methods: {
    async login() {
      if (!this.username) return (this.message = "You must enter a username!");
      if (!this.password) return (this.message = "You must enter a password!");
      else {
        LoginService.login(this.username, this.password)
          .then(data => {
            this.username = data.data;
            this.message = "Logged In Sucessfully (200)";
            this.$store.commit("changeUser", data.data);
            this.$router.push("/home");
          })
          .catch(err => {
            if (err.toString().includes("403"))
              this.message = "Incorrect Username or Password (403)";
            else {
              (this.message = err.toString()),
                console.log("msg: ", this.message);
            }
          });
      }
    }
  }
};
</script>
<style>
</style>