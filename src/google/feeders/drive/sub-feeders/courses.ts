// Externals
import Logger from "@hack4impact/logger";
import { drive_v3 } from "googleapis";

// Internals
import Drive from "../index";

class Courses {
  private drive: drive_v3.Drive;

  constructor(drive: drive_v3.Drive) {
    this.drive = drive;
  }

  async entry(): Promise<void> {
    Logger.line();
    Logger.bold("Courses");

    const courses = await Drive.getFolders(
      this.drive,
      process.env.COURSES_FOLDER ?? ""
    );

    for (const course of courses) {
      Logger.line();
      Logger.coloredLog("FgBlue", course.name);

      const sections = await Drive.getFolders(this.drive, course.id ?? "");

      for (const section of sections) {
        Logger.log(section.name);

        const lessons = await Drive.getFolders(this.drive, section.id ?? "");

        for (const lesson of lessons) {
          Logger.log(`\t${lesson.name}`);

          const contents = await Drive.getContents(this.drive, lesson.id ?? "");

          const scriptName = lesson.name?.slice(3) ?? "";

          const docs = contents.filter(
            (content) => content.mimeType === Drive.DOCS_MIME
          );

          if (!docs.length) {
            const res = await this.drive.files.create({
              requestBody: {
                name: scriptName,
                mimeType: Drive.DOCS_MIME,
                parents: [lesson.id ?? ""],
              },
              fields: "id",
            });

            Logger.success(`\t\tCreated Script Doc: '${res.data.id}'!`);
          } else if (docs.length === 1) {
            const doc = docs[0];

            if (doc.name !== scriptName) {
              const res = await this.drive.files.update({
                fileId: doc.id ?? "",
                requestBody: {
                  name: scriptName,
                },
                fields: "name",
              });

              Logger.success(
                `\t\tRenamed Script Doc from '${doc.name}' to '${res.data.name}'!`
              );
            }
          }
        }
      }
    }
  }
}

export default Courses;
