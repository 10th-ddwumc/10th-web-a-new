export interface Lp {
  id: number;
  title: string;        
  thumbnail: string;  
  content?: string;    
  createdAt: string;    
  updatedAt: string;
  likesCount?: number;
  isLiked?: boolean;
  authorId: number;
    user: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
}


export interface ResponseLpListDto {
  data: Lp[];          
  meta: {
    page: number;      
    take: number;       
    itemCount: number; 
    pageCount: number;  
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}