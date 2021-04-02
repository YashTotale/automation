// Environment Variables
import { config } from "dotenv-safe";
config();

// Internals
import googleAuth from "./google-auth";
import feeders from "./feeders";

class GoogleAutomation {
  async entry(): Promise<void> {
    const auth = await googleAuth();

    for (const Feeder of feeders) {
      await new Feeder(auth).entry();
    }
  }
}

new GoogleAutomation().entry();
