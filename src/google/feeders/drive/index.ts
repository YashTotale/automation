// Externals
import { google, Auth, drive_v3 } from "googleapis";

// Internals
import subFeeders from "./sub-feeders";

class Drive {
  public static readonly FOLDER_MIME = "application/vnd.google-apps.folder";
  public static readonly DOCS_MIME = "application/vnd.google-apps.document";

  private oauth: Auth.OAuth2Client;

  constructor(oauth: Auth.OAuth2Client) {
    this.oauth = oauth;
  }

  async entry(): Promise<void> {
    const drive = google.drive({
      version: "v3",
      auth: this.oauth,
    });

    for (const SubFeeder of subFeeders) {
      await new SubFeeder(drive).entry();
    }
  }

  static async getContents(
    drive: drive_v3.Drive,
    folderId: string
  ): Promise<Required<drive_v3.Schema$FileList>["files"]> {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
    });

    if (!res.data.files) return [];

    return res.data.files;
  }

  static async getFolders(
    drive: drive_v3.Drive,
    folderId: string
  ): Promise<Required<drive_v3.Schema$FileList>["files"]> {
    const files = await Drive.getContents(drive, folderId);

    return files.filter((file) => file.mimeType === Drive.FOLDER_MIME);
  }
}

export default Drive;
