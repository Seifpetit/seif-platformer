// /src/core/importVideo.js

//
// Extract a thumbnail (first frame) from the video
//
async function extractThumbnail(videoEl) {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    resolve(dataURL);
  });
}

//
// Core importer
//
export async function importVideo(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        // Extract thumbnail image
        const thumb = await extractThumbnail(video);

        const asset = {
          id: crypto.randomUUID(),
          type: "video",
          name: file.name,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          url,             // blob URL
          file,
          thumbnail: thumb // base64 PNG
        };

        resolve(asset);
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = () => {
      reject("Failed to load video file");
    };
  });
}
