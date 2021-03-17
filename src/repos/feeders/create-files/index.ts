// Externals
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Logger from "@hack4impact/logger";
import { Octokit } from "@octokit/rest";

// Internals
import { GITHUB_USER } from "../../../constants";
import { BaseRepoArrContent, Repo } from "../../types";

const aliases: Record<string, string[]> = {
  "README.md": ["README", "README.txt"],
  "LICENSE.md": ["LICENSE", "LICENSE.txt"],
};

class CreateFiles {
  public static TEMPLATES_PATH = join(__dirname, "templates");
  private static fileContents: Record<string, string> | null = null;

  private octokit: Octokit;
  private repo: Repo;

  constructor(octokit: Octokit, repo: Repo) {
    this.octokit = octokit;
    this.repo = repo;
  }

  async entry(): Promise<void> {
    if (CreateFiles.fileContents === null) await CreateFiles.getTemplateFiles();

    const response = await this.octokit.repos.getContent({
      owner: GITHUB_USER,
      repo: this.repo.name,
      path: "",
    });
    const { data: repoContents } = response;

    for (const file in CreateFiles.fileContents) {
      const alreadyExists = await this.checkIfFileExists(
        file,
        repoContents as BaseRepoArrContent
      );

      if (alreadyExists) continue;

      const replacements = {
        "{{repo-name}}": this.repo.name,
        "{{year}}": new Date().getFullYear().toString(),
      };

      let content = CreateFiles.fileContents[file];

      Object.entries(replacements).forEach(([key, value]) => {
        content = content.replaceAll(key, value);
      });

      await this.octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_USER,
        repo: this.repo.name,
        content: Buffer.from(content).toString("base64"),
        message: `(automated) Added ${file}`,
        path: file,
      });
      Logger.success(`Created ${file}!`);
    }
  }

  async checkIfFileExists(
    file: string,
    repoContents: BaseRepoArrContent
  ): Promise<boolean> {
    const aliasArr = aliases[file];

    const alreadyExists = repoContents.find((content) => {
      if (content.type !== "file") return false;

      const lowercased = content.name.toLowerCase();

      if (lowercased === file.toLowerCase()) return true;

      if (aliasArr?.find((alias) => alias.toLowerCase() === lowercased))
        return true;

      return false;
    });

    return !!alreadyExists;
  }

  static async getTemplateFiles() {
    const files = await readdir(CreateFiles.TEMPLATES_PATH, "utf-8");

    for (const file of files) {
      const FILE_PATH = join(CreateFiles.TEMPLATES_PATH, file);

      const content = await readFile(FILE_PATH, "utf-8");

      if (CreateFiles.fileContents === null) CreateFiles.fileContents = {};

      CreateFiles.fileContents[file] = content;
    }
  }
}

export default CreateFiles;
