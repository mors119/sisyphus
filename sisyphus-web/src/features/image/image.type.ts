export interface UploadImageResponse {
  id: number;
  url: string;
  originName: string;
  extension: string;
  size: number;
}

export interface ImageResponse {
  id: number;
  originName: string;
  url: string;
}
