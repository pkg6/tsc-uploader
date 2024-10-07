const DEFAULT_CHUNKSIZE = 10 * 1000 * 1000;

interface IUploader {
  onProgress?: (uploadedChunks: number, totalChunks: number) => void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  upload(file: File): any;
}

interface IConfig {
  endport: string;
  name: string;
  chunkSize: number;
  header?: HeadersInit;
  formData?: FormData;
  onProgress?: (uploadedChunks: number, totalChunks: number) => void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

interface IBlobData {
  start: Number;
  end: Number;
  blob: Blob;
}

const fileSliceBlob = (
  file: File,
  currentChunk: number,
  chunkSize: number
): IBlobData => {
  let start = currentChunk * chunkSize;
  let end = Math.min(file.size, start + chunkSize);
  let blob = file.slice(start, end)
  return {
    start: start,
    end: end,
    blob: blob,
  };
};




export { IUploader, IConfig, DEFAULT_CHUNKSIZE, fileSliceBlob };
