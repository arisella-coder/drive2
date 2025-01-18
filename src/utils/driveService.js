import dotenv from "dotenv";
import { getDriveClient } from "../config/googleConfig.js";
dotenv.config();

const drive1Client = getDriveClient(process.env.DRIVE1_CREDENTIALS_PATH);
const drive2Client = getDriveClient(process.env.DRIVE2_CREDENTIALS_PATH);

export { drive1Client, drive2Client };
