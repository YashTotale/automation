// Environment Variables
import { config } from "dotenv-safe";
config();

// Externals
import Logger from "@hack4impact/logger";

// Internals
import googleAuth from "./google-auth";
import feeders from "./feeders";

class GoogleAutomation {
  async entry(): Promise<void> {
    Logger.bold("Google Automation");
    Logger.line();

    const auth = await googleAuth();

    for (const Feeder of feeders) {
      await new Feeder(auth).entry();
    }
  }
}

new GoogleAutomation().entry();
