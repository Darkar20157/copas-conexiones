export interface IUserProfile {
  id: string
  name: string
  age: number
  photos: string[]
  description: string
  hobbies: string[]
}

export interface ICardMatches {
  user: IUserProfile
  onSwipeLeft: (userId: string) => void
  onSwipeRight: (userId: string) => void
  onSuperLike: (userId: string) => void
}

export interface ICarouselImage {
  photos: string[]
  currentImageIndex: number
  nextImage: () => void
  prevImage: () => void
}