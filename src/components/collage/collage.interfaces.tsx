export interface ICollage {
  photos: string[];
  maxPhotos?: number;
  onClick?: (index: number) => void;
}