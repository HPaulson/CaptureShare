import axios from "axios";
import config from "../../../app/config.json";

const BASE_URL = `${config.server.host}/api/`;

class LoginService {

  static async login(username: string, password: string) {

    return axios
      .post(BASE_URL + "login/", {

        username: username,
        password: password
      })

      .then(async (x: any) => {

        return x.data;
      });
  }
}

export default LoginService;
