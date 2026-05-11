import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
    Check,
    EllipsisVertical,
    Heart,
    ImageIcon,
    Pencil,
    Trash2,
} from "lucide-react";

import { getLpDetail } from "../apis/ip";
import { QUERY_KEY } from "../constants/key";
import { useGetLpComments } from "../hooks/queries/useGetLpComments";
import { useAuth } from "../context/AuthContext";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostComment from "../hooks/mutations/usePostComment";
import usePatchComment from "../hooks/mutations/usePatchComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import usePatchLp from "../hooks/mutations/usePatchLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import { fileToDataUrl } from "../utills/file";
import type { LpComment } from "../types/comment";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const lpIdNumber = Number(lpid);

    const { accessToken, userName } = useAuth();
    const { data: me } = useGetMyInfo(accessToken); // 상세페이지는 토큰없어도 되지만 얘는 토큰있어야 실행되어야함

    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const [commentInput, setCommentInput] = useState("");

    // 댓글 메뉴, 수정 상태 관리
    const [openedCommentMenuId, setOpenedCommentMenuId] = useState<number | null>(
        null,
    );
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    );
    const [editingCommentContent, setEditingCommentContent] = useState("");

    //  LP 상세 수정 상태 관리
    const lpImageInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditingLp, setIsEditingLp] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editThumbnail, setEditThumbnail] = useState("");
    const [editTagInput, setEditTagInput] = useState("");
    const [editTags, setEditTags] = useState<string[]>([]);

    const { data: detailData, isLoading: isDetailLoading } = useQuery({
        queryKey: [QUERY_KEY.lps, lpIdNumber],
        queryFn: () => getLpDetail({ lpid: lpIdNumber }),
        enabled: !!lpid,

        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });

    const lp = detailData?.data;

    useEffect(() => {
        if (!lp) return;

        setEditTitle(lp.title ?? "");
        setEditContent(lp.content ?? "");
        setEditThumbnail(lp.thumbnail ?? "");
        setEditTags(lp.tags?.map((tag) => tag.name) ?? []);
    }, [lp]);

    //mutate -> 비동기 요청을 실행하고, 콜백 함수를 이용해서 후속 작업을 처리함
    //mutateAsync -> Promise를 반환해서 await 사용 가능
    const { mutate: likeMutate } = usePostLike();
    const { mutate: disLikeMutate } = useDeleteLike();

    const { mutate: postCommentMutate, isPending: isPostingComment } =
        usePostComment(lpIdNumber);
    const { mutate: patchCommentMutate, isPending: isPatchingComment } =
        usePatchComment(lpIdNumber);
    const { mutate: deleteCommentMutate } = useDeleteComment(lpIdNumber);

    const { mutate: patchLpMutate, isPending: isPatchingLp } = usePatchLp();
    const { mutate: deleteLpMutate, isPending: isDeletingLp } = useDeleteLp();

    const handleLikeLp = () => {
        if (!lpid) return;
        likeMutate({ lpid: lpIdNumber });
    };

    const handleDislikeLp = () => {
        if (!lpid) return;
        disLikeMutate({ lpid: lpIdNumber });
    };

    // const isLiked = lp?.data.likes
    //     .map((like) => like.userld)
    //     .includes(me?.data.id as number);
    //아래와 동일한 표현
    const isLiked = !!lp?.likes?.some((like) => like.userId === me?.data.id);

    const {
        data: commentData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpComments(lpid ?? "", commentOrder);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const comments: LpComment[] =
        commentData?.pages
            ?.flatMap((page: any) => {
                // 서버 응답 구조가 다를 수 있어서 안전하게 추출
                const rawData = page?.data?.data ?? page?.data;

                if (Array.isArray(rawData)) return rawData;
                if (Array.isArray(rawData?.data)) return rawData.data;

                return [];
            }) ?? [];

    const handleAddComment = () => {
        if (!commentInput.trim()) return;

        postCommentMutate(
            {
                lpId: lpIdNumber,
                body: {
                    content: commentInput,
                },
            },
            {
                // 댓글 생성 성공 시 입력창 초기화
                onSuccess: () => {
                    setCommentInput("");
                },
            },
        );
    };

    const handleStartEditComment = (comment: LpComment) => {
        setEditingCommentId(comment.id);
        setEditingCommentContent(comment.content);
        setOpenedCommentMenuId(null);
    };

    const handlePatchComment = (commentId: number) => {
        if (!editingCommentContent.trim()) return;

        patchCommentMutate(
            {
                lpId: lpIdNumber,
                commentId,
                body: {
                    content: editingCommentContent,
                },
            },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditingCommentContent("");
                },
            },
        );
    };

    const handleDeleteComment = (commentId: number) => {
        deleteCommentMutate({
            lpId: lpIdNumber,
            commentId,
        });

        setOpenedCommentMenuId(null);
    };

    const handleClickEditImage = () => {
        if (!isEditingLp) return;
        lpImageInputRef.current?.click();
    };

    const handleChangeEditImage = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const previewUrl = await fileToDataUrl(file);
        setEditThumbnail(previewUrl);
    };

    const handleAddEditTag = () => {
        const trimmedTag = editTagInput.trim();

        if (!trimmedTag) return;
        if (editTags.includes(trimmedTag)) {
            setEditTagInput("");
            return;
        }

        setEditTags([...editTags, trimmedTag]);
        setEditTagInput("");
    };

    const handleRemoveEditTag = (targetTag: string) => {
        setEditTags(editTags.filter((tag) => tag !== targetTag));
    };

    const handlePatchLp = () => {
        patchLpMutate(
            {
                lpid: lpIdNumber,
                body: {
                    title: editTitle,
                    content: editContent,
                    thumbnail: editThumbnail,
                    tags: editTags,
                    published: true,
                },
            },
            {
                onSuccess: () => {
                    setIsEditingLp(false);
                },
            },
        );
    };

    const handleDeleteLp = () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        deleteLpMutate({
            lpid: lpIdNumber,
        });
    };

    if (isDetailLoading) {
        return (
            <div className="pt-32 max-w-2xl mx-auto">
                <LpCardSkeleton />
            </div>
        );
    }

    if (!lp) {
        return (
            <div className="pt-32 text-center text-white">
                LP 정보를 불러올 수 없습니다.
            </div>
        );
    }

    const authorName = lp.author?.name ?? userName ?? "김연진";
    const isMyLp = lp.authorId === me?.data.id;

    return (
        <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto text-white">
            <div className="bg-[#24272E] rounded-3xl p-10 shadow-2xl">
                <input
                    ref={lpImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeEditImage}
                />

                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <span className="font-bold">{authorName}</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <span className="text-sm text-gray-300">
                            {new Date(lp.createdAt).toLocaleString()}
                        </span>

                        {isMyLp && (
                            <>
                                {isEditingLp ? (
                                    <button
                                        onClick={handlePatchLp}
                                        disabled={isPatchingLp}
                                        className="hover:text-pink-500 disabled:opacity-50"
                                    >
                                        <Check size={28} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditingLp(true)}
                                        className="hover:text-pink-500"
                                    >
                                        <Pencil size={25} />
                                    </button>
                                )}

                                <button
                                    onClick={handleDeleteLp}
                                    disabled={isDeletingLp}
                                    className="hover:text-pink-500 disabled:opacity-50"
                                >
                                    <Trash2 size={25} />
                                </button>
                            </>
                        )}

                        <button
                            onClick={isLiked ? handleDislikeLp : handleLikeLp}
                            className="hover:scale-110 transition-transform"
                        >
                            <Heart
                                color={isLiked ? "red" : "white"}
                                fill={isLiked ? "red" : "transparent"}
                            />
                        </button>
                    </div>
                </div>

                {isEditingLp ? (
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mb-6 w-full rounded-md border border-white bg-transparent px-4 py-3 text-3xl font-bold outline-none"
                    />
                ) : (
                    <h1 className="mb-8 text-3xl font-bold">{lp.title}</h1>
                )}

                <button
                    type="button"
                    onClick={handleClickEditImage}
                    className="relative mb-8 block w-full overflow-hidden rounded-md"
                >
                    {editThumbnail ? (
                        <img
                            src={editThumbnail}
                            alt={lp.title}
                            className="mx-auto max-h-[620px] w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-[420px] items-center justify-center bg-gray-700">
                            이미지 없음
                        </div>
                    )}

                    {isEditingLp && (
                        <div className="absolute right-6 top-6 rounded-full bg-black/60 p-3">
                            <ImageIcon size={26} />
                        </div>
                    )}
                </button>

                {isEditingLp ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mb-6 min-h-28 w-full resize-none rounded-md border border-white bg-transparent px-4 py-4 text-xl outline-none"
                    />
                ) : (
                    <p className="mb-8 whitespace-pre-wrap rounded-md border border-white px-4 py-4 text-xl">
                        {lp.content}
                    </p>
                )}

                {isEditingLp ? (
                    <div className="mb-10">
                        <div className="mb-6 flex gap-3">
                            <input
                                value={editTagInput}
                                onChange={(e) =>
                                    setEditTagInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddEditTag();
                                    }
                                }}
                                placeholder="LP Tag"
                                className="flex-1 rounded-md border border-gray-500 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-pink-500"
                            />

                            <button
                                onClick={handleAddEditTag}
                                className="rounded-md bg-slate-400 px-8 py-3 font-bold text-white hover:bg-pink-500"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {editTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleRemoveEditTag(tag)}
                                    className="rounded-2xl bg-slate-700 px-5 py-2 text-lg"
                                >
                                    #{tag} <span className="ml-2">×</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-10 flex flex-wrap justify-center gap-4">
                        {lp.tags?.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-2xl bg-slate-700 px-5 py-2 text-lg"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-10 rounded-3xl bg-[#24272E] p-8">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">댓글</h2>

                    <div className="flex overflow-hidden rounded-md border border-white">
                        <button
                            onClick={() => setCommentOrder("asc")}
                            className={`px-8 py-3 text-lg font-bold ${commentOrder === "asc"
                                ? "bg-[#24272E] text-white"
                                : "bg-white text-black"
                                }`}
                        >
                            오래된순
                        </button>

                        <button
                            onClick={() => setCommentOrder("desc")}
                            className={`px-8 py-3 text-lg font-bold ${commentOrder === "desc"
                                ? "bg-white text-black"
                                : "bg-[#24272E] text-white"
                                }`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                <div className="mb-10 flex gap-4">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="댓글을 입력해주세요"
                        className="flex-1 rounded-md border border-gray-400 bg-transparent px-5 py-4 text-xl outline-none placeholder:text-gray-400 focus:border-pink-500"
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleAddComment()
                        }
                    />

                    <button
                        onClick={handleAddComment}
                        disabled={isPostingComment}
                        className="rounded-md bg-slate-400 px-8 py-4 text-xl font-bold text-white hover:bg-pink-500 disabled:opacity-50"
                    >
                        {isPostingComment ? "작성중" : "작성"}
                    </button>
                </div>

                <div className="flex flex-col gap-8">
                    {comments.map((comment) => {
                        const displayName =
                            comment.author?.name ||
                            comment.authorName ||
                            comment.nickname ||
                            "연진김";

                        const commentAuthorId =
                            comment.author?.id ??
                            comment.authorId ??
                            comment.userId;

                        const isMyComment = commentAuthorId === me?.data.id;
                        const isEditingComment =
                            editingCommentId === comment.id;

                        return (
                            <div
                                key={comment.id}
                                className="relative flex items-start gap-5"
                            >
                                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

                                <div className="flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xl font-bold">
                                            {displayName}
                                        </span>

                                        {isMyComment && (
                                            <button
                                                onClick={() =>
                                                    setOpenedCommentMenuId(
                                                        openedCommentMenuId ===
                                                            comment.id
                                                            ? null
                                                            : comment.id,
                                                    )
                                                }
                                                className="hover:text-pink-500"
                                            >
                                                <EllipsisVertical />
                                            </button>
                                        )}
                                    </div>

                                    {isEditingComment ? (
                                        <div className="flex items-center gap-4">
                                            <input
                                                value={editingCommentContent}
                                                onChange={(e) =>
                                                    setEditingCommentContent(
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-md border border-white bg-transparent px-4 py-3 text-xl outline-none"
                                            />

                                            <button
                                                onClick={() =>
                                                    handlePatchComment(
                                                        comment.id,
                                                    )
                                                }
                                                disabled={isPatchingComment}
                                                className="hover:text-pink-500 disabled:opacity-50"
                                            >
                                                <Check size={30} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xl">
                                            {comment.content}
                                        </p>
                                    )}
                                </div>

                                {openedCommentMenuId === comment.id && (
                                    <div className="absolute right-0 top-12 flex gap-5 rounded-xl bg-black px-5 py-4">
                                        <button
                                            onClick={() =>
                                                handleStartEditComment(comment)
                                            }
                                            className="hover:text-pink-500"
                                        >
                                            <Pencil size={28} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="hover:text-pink-500"
                                        >
                                            <Trash2 size={28} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div ref={ref} className="h-4" />

                {isFetchingNextPage && (
                    <div className="py-4 text-center text-sm text-gray-500">
                        댓글 로딩 중...
                    </div>
                )}
            </div>
        </div>
    );
};

export default LpDetailPage;