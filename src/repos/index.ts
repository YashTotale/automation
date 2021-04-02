// Environment Variables
import { config } from "dotenv-safe";
config();

// Externals
import { Octokit } from "@octokit/rest";
import Logger from "@hack4impact/logger";

// Internals
import { differenceInMinutes } from "../utils";
import { GITHUB_USER } from "../constants";
import { Repo } from "./types";
import feeders from "./feeders";

class RepoAutomation {
  private octokit: Octokit;
  private repos: Repo[];

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: `token ${token}`,
      userAgent: GITHUB_USER,
    });
  }

  async entry(): Promise<void> {
    Logger.bold("Repo Automation");

    await this.getRepos();

    for (const repo of this.repos) {
      if (!repo.fork) {
        Logger.line();
        Logger.bold(repo.name);

        for (const Feeder of feeders) {
          await new Feeder(this.octokit, repo).entry();
        }

        await this.logRateLimit();
      }
    }
  }

  async getRepos(): Promise<void> {
    const response = await this.octokit.repos.listForUser({
      username: GITHUB_USER,
    });

    this.repos = response.data;
  }

  async logRateLimit(): Promise<void> {
    const response = await this.octokit.rateLimit.get();
    const { data: rateLimit } = response;

    const requestsRemaining = `${rateLimit.rate.remaining} requests remaining out of ${rateLimit.rate.limit}.`;
    const resets = `Resets in ${differenceInMinutes(
      new Date(rateLimit.rate.reset * 1000),
      new Date()
    )} minutes.`;

    Logger.log(
      `${Logger.COLORS.Dim}${requestsRemaining} ${resets}${Logger.COLORS.Reset}`
    );
  }
}

if (typeof process.env.GITHUB_TOKEN === "string") {
  new RepoAutomation(process.env.GITHUB_TOKEN).entry();
} else {
  throw new Error("GITHUB_TOKEN environment variable not set");
}
