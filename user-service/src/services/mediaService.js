import { mediaClient } from "../grpc/mediaClient.js";

export const uploadMediaToMediaService = (file,fileName,fileType,fileSize) => {
  return new Promise((resolve, reject) => {
    mediaClient.UploadMedia({ file,fileName,fileType,fileSize }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};
export const updateMediaToMediaService = (media_id,file,fileName,fileType,fileSize) => {
  return new Promise((resolve, reject) => {
    mediaClient.UpdateMedia({ media_id,file,fileName,fileType,fileSize }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};
