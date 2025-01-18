import fs from "fs";
import { google } from "googleapis";
const getDriveClient = (credentialsPath) => {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
};

export {getDriveClient};