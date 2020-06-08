import axios from "axios";
import config from "../../../app/config.json";

const BASE_URL = `${config.server.host}/`;

class UploadService {
  static async upload(formData: any, user: any) {
    let userPass;
    config.users.forEach((users) => {
      if (users.username === user) {
        userPass = users.password
        }
})
const conf = {
  headers: {
    Authorization: userPass,
    client: true
  }
}
    return axios.post(BASE_URL + "api/upload", formData, conf).then(async x => {
      const uploadedFiles: any = [];
      await x.data.data.forEach((index: any) => {
        uploadedFiles.push({
          url: `${config.server.host}/${index.data._id}`
        });
      });
      return uploadedFiles;
    });
  }

  static async remove(id: string, user: string) {
    let userPass;
    config.users.forEach((users) => {
      if (users.username === user) {
        userPass = users.password
        }
})
const conf = {
  headers: {
    Authorization: userPass,
    client: true
  }
}
    await axios.delete(BASE_URL + "api/upload/" + id, conf);
  }

  static async getFiles(user: string) {
    let userPass;
    config.users.forEach((users) => {
      if (users.username === user) {
        userPass = users.password
        }
})
    const conf = {
      headers: {
        Authorization: userPass,
        client: true
      }
    }
    return axios.get(BASE_URL + "api/upload/", conf).then(async x => {
      return x.data.data;
    });
  }
}

export default UploadService;
