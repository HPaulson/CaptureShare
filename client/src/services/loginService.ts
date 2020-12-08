import axios from "axios";
import config from "../../../app/config.json";

const baseURL = `${config.server.host}`;

class LoginService {
  static async login(username: string, password: string) {
    return axios
      .post(baseURL + "/api/login/", {
        username: username,
        password: password
      })

      .then(async (x: any) => {
        return x.data;
      });
  }
}

export default LoginService;
