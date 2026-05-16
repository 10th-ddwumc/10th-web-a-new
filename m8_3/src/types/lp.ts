export interface Lp {
  id: number;
  title: string;
  thumbnail: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number; 
  likes: Like[]; 
  isLiked?: boolean; 
  authorId: number;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
}

export interface Like {
  id: number;
  userId: number;
  lpId: number;
}