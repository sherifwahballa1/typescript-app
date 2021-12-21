import { Model } from "mongoose";

import { NewLogin } from "../../interfaces/ISession";
import { SessionDoc } from "../../interfaces/mongo/Session";
import { Session } from "../../models/Session";

export default class SessionManager {
  private sessionModel: Model<SessionDoc>;

  constructor() {
    this.sessionModel = Session;
  }

  async login(id: string): Promise<NewLogin> {
    // check if user session existing
    let record = await this.sessionModel.findOne({ user: id })

    // create and init session if not exists
    if (!record) {
      record = new this.sessionModel();
      record.initSession(id);
    }

    // update user sessions array
    let newLogin = record.newLogin();
    await record.save();
    return newLogin;
  }
}