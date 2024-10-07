import RangesChunkUploader from "./rangesChunkUploader";
import { IConfig, IUploader } from "./types";

const rangesChunk = (config: IConfig): IUploader => {
  const uploader = new RangesChunkUploader(config);
  return uploader;
};
export default {
  rangesChunk,
};
export * from "./rangesChunkUploader";
export * from "./types";

(window as any).rangesChunk = rangesChunk;

