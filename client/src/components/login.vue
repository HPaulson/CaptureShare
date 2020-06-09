<template>
  <div class="html">
    <div class="body">
      <main id="main-holder">
        <h1 id="login-header" style="color:white;">Login</h1>

        <div id="login-error-msg-holder">
          <p
            id="login-error-msg"
            v-if="message.includes(403)"
            style="color: red"
          >
            {{ message }}
          </p>
          <p
            id="login-error-msg"
            v-if="message.includes(200)"
            style="color: green"
          >
            {{ message }}
          </p>
        </div>

        <div id="login-form">
          <input
            type="text"
            v-model="username"
            name="username"
            @keyup.enter="login()"
            value=":username"
            id="username-field"
            class="login-form-field"
            placeholder="Username"
          />
          <input
            type="password"
            v-model="password"
            name="password"
            @keyup.enter="login()"
            value=":password"
            id="password-field"
            class="login-form-field"
            placeholder="Password"
          />
          <button v-on:click="login()" value="Login" id="login-form-submit">
            Submit
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
const loginForm = document.getElementById("login-form");
const loginButton = Document.getElementById("login-form-submit");

loginButton.addEventListener("click", e => {
  e.preventDefault();
  this.username = loginForm.username.value;
  this.password = loginForm.password.value;
  this.login()
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
      password: "",
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
            this.$store.commit("changeUser", data.data)
            this.$router.push("/home");
          })
          .catch(() => {
            this.message = "Incorrect Username or Password (403)";
          });
      }
    }
  }
};
</script>

<style scoped>
.html {
  height: 100%;
}
.body {
  height: 100%;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  display: grid;
  justify-items: center;
  align-items: center;
  background-image: url("https://wizmove.com/wp-content/uploads/2017/12/dark-background-8.jpg");
  background-color: #cccccc;
}

#main-holder {
  width: 50%;
  height: 40%;
  display: grid;
  justify-items: center;
  align-items: center;
  background-color: #4646466b;
  border-radius: 7px;
  box-shadow: 0px 0px 5px 2px rgb(27, 27, 27);
}
@media (max-width: 480px) {
  #main-holder {
    width: 80%;
    height: 40%;
  }
}

#login-form {
  align-self: flex-start;
  display: grid;
  justify-items: center;
  align-items: center;
}

.login-form-field::placeholder {
  color: black;
}

.login-form-field {
  background-color: #464646;
  color: black;
  border: none;
  border-bottom: 1px solid black;
  margin-bottom: 10px;
  border-radius: 3px;
  outline: none;
  padding: 0px 0px 5px 5px;
}

#login-form-submit {
  width: 100%;
  padding: 7px;
  border: none;
  border-radius: 5px;
  color: black;
  font-weight: bold;
  background-color: #00adb5;
  cursor: pointer;
  outline: none;
}
</style>
