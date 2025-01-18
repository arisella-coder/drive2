import { drive1Client, drive2Client } from "../utils/driveService.js";

const getDriveClient = (driveType) => {
  return driveType === "drive1" ? drive1Client : drive2Client;
};

const listFiles = async (req, res) => {
  try {
    const { driveType, folderId } = req.query; // 'drive1' or 'drive2', optional folderId
    const driveClient = getDriveClient(driveType);
    let query = "";

    if (folderId) {
      query = `'${folderId}' in parents`;
    } else {
      query = "'root' in parents or sharedWithMe";
    }
    const response = await driveClient.files.list({
      q: query,
      fields: "files(id,name,mimeType,parents,iconLink,webContentLink)",
      pageSize: 100,
    });
    res.status(200).json({ files: response.data.files });
  } catch (error) {
    console.error("Error listing files:", error.message);
    res.status(500).json({ message: "Error listing files", error });
  }
};

// Download File Route
const downloadFile= async (req, res) => {
  try {
    const { driveType, fileId } = req.params;
    const driveClient = getDriveClient(driveType);

    const fileMetadata = await driveClient.files.get({
      fileId: fileId,
      fields: 'mimeType, name'
    });



    const file = await driveClient.files.get(
      {
        fileId: fileId,
        alt: "media", // This ensures we get the raw file content
      },
      { responseType: "stream" }
    ); //  Specifies that the response will be a stream.

    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + fileMetadata.data.name
    );
    res.setHeader("Content-type", fileMetadata.data.mimeType);

    file.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Error downloading file", error });
  }
}

export { listFiles,downloadFile };
