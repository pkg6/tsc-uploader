import { DEFAULT_CHUNKSIZE, IConfig, IUploader } from "./types";

class RangesChunkUploader implements IUploader {
  config: IConfig;

  private fileSize?: number;

  private rangesData: Record<string, string>;

  constructor(config: IConfig) {
    this.config = config;
    this.rangesData = {};
  }
  public async upload(file: File) {
    this.fileSize = file.size;
    const chunkSize = this.config.chunkSize ?? DEFAULT_CHUNKSIZE;
    const totalChunks = Math.ceil(this.fileSize / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      try {
        await this.chunkPost(chunk, i);
        this.config.onProgress?.(i + 1, totalChunks);
      } catch (error) {
        this.config.onError?.(
          error instanceof Error ? error : new Error(String(error))
        );
        return;
      }
    }
    this.config.onSuccess?.();
  }
  private setRanges() {
    const fileSize = this.fileSize ? String(this.fileSize) : "0";
    this.rangesData = {
      "Accept-Ranges": "bytes",
      "Content-Length": fileSize,
    };
  }

  private async chunkPost(chunk: Blob, index: number) {
    const formData = new FormData();
    formData.append(this.config.name, chunk, `chunk-${index}`);
    await fetch(this.config.endport!, {
      method: "POST",
      body: {
        ...formData,
        ...this.config.formData,
        ...this.rangesData,
      },
      headers: {
        ...this.config.header,
        ...this.rangesData,
      },
    });
  }
}

export default RangesChunkUploader;
