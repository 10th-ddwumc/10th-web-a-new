export interface SignUpFormData {
  email: string;
  password?: string;        
  passwordConfirm?: string;
  nickname?: string;
}


export interface UserInfo {
  email: string;
  nickname: string;
  isLoggedIn: boolean;
  joinedAt: string;
}