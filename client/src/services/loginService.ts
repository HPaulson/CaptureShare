import axios from "axios";
import config from "../../../app/config.json";

const BASE_URL = `${config.server.host}`;

class LoginService {
  static async login(username: string, password: string) {
    return axios
      .post(BASE_URL + "/api/login/", {
        username: username,
        password: password
      })

      .then(async (x: any) => {
        return x.data;
      });
  }
}

export default LoginService;
