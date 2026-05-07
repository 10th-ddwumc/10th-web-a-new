import type { CommonResponse } from "./common.ts";

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  publicVisibility: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
  tags: { id: number; name: string }[];
  likes: { userId: number }[];
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

export type ResponseLpsDto = CommonResponse<{
  data: Lp[];
  hasNextPage: boolean;
  nextCursor: number | null;
}>;

export type ResponseLpDto = CommonResponse<Lp>;

export type ResponseCommentsDto = CommonResponse<{
  data: Comment[];
  hasNextPage: boolean;
  nextCursor: number | null;
}>;
