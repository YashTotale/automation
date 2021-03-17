// Externals
import Logger from "@hack4impact/logger";
import { Octokit } from "@octokit/rest";

// Internals
import { GITHUB_USER } from "../../constants";
import { Repo } from "../types";

class StarRepo {
  private octokit: Octokit;
  private repo: Repo;

  constructor(octokit: Octokit, repo: Repo) {
    this.octokit = octokit;
    this.repo = repo;
  }

  async entry(): Promise<void> {
    await this.octokit.activity.starRepoForAuthenticatedUser({
      owner: GITHUB_USER,
      repo: this.repo.name,
    });

    Logger.success("Starred repository!");
  }
}

export default StarRepo;
