import { R } from "./runtime.js";

export async function importAudioFile(file) {

  const arrayBuffer = await file.arrayBuffer();

  const buffer = await R.audioCtx.decodeAudioData(arrayBuffer);

  const id = crypto.randomUUID();

  R.data.audio.assets.push({
    id,
    name: file.name,
    buffer,
    duration: buffer.duration,
    createdAt: Date.now(),
    tags: [],

  });
  
}