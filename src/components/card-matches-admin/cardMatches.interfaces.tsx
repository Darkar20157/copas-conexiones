export interface IUserProfile {
  id: number;
  name: string;
  photos?: string[];
  description: string;
  birthdate: string;
  gender: string;
}

export interface ICardMatches {
  user: IUserProfile;
  type?: "no_me_gusta" | "me_gusta" | "me_encanta";
  width?: number;   // 🔹 nuevo
  height?: number;  // 🔹 nuevo
  onSwipeLeft?: (id: number) => void;
  onSwipeRight?: (id: number) => void;
  onSuperLike?: (id: number) => void;
}

export interface ICarouselImage {
  photos?: string[]
  currentImageIndex: number
  nextImage: () => void
  prevImage: () => void
}