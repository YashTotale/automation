import { Auth } from "googleapis";

class Drive {
  private oauth: Auth.OAuth2Client;

  constructor(oauth: Auth.OAuth2Client) {
    this.oauth = oauth;
  }

  async entry(): Promise<void> {
    //
  }
}

export default Drive;
