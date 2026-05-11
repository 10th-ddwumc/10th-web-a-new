import { useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { X } from "lucide-react";
import usePostLp from "../hooks/mutations/usePostLp";
import { fileToDataUrl } from "../utills/file";
import type { RequestCreateLpDto } from "../types/lp";

interface AddLpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddLpModal = ({ isOpen, onClose }: AddLpModalProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState("");

    const { mutate: postLpMutate, isPending } = usePostLp();

    const resetForm = () => {
        setTitle("");
        setContent("");
        setTagInput("");
        setTags([]);
        setThumbnail("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleClickImage = () => {
        fileInputRef.current?.click();
    };

    // 사진 파일 선택 시 미리보기용 base64 문자열로 변환
    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const previewUrl = await fileToDataUrl(file);
        setThumbnail(previewUrl);
    };

    //  태그 추가
    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();

        if (!trimmedTag) return;

        if (tags.includes(trimmedTag)) {
            setTagInput("");
            return;
        }

        setTags([...tags, trimmedTag]);
        setTagInput("");
    };

    //  태그 삭제
    const handleRemoveTag = (targetTag: string) => {
        setTags(tags.filter((tag) => tag !== targetTag));
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Add LP 클릭 시 useMutation으로 LP 생성 요청
    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            alert("LP 제목과 내용을 입력해주세요.");
            return;
        }

        const body: RequestCreateLpDto = {
            title,
            content,
            thumbnail,
            tags,
            published: true,
        };

        postLpMutate(body, {
            // POST 요청 성공 시 모달 닫기
            onSuccess: () => {
                resetForm();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70"
            onClick={handleClose}
        >
            <div
                className="relative w-[520px] max-w-[92vw] rounded-2xl bg-[#2A2D34] p-8 text-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-7 top-6 text-white hover:text-pink-500"
                >
                    <X size={26} />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeFile}
                />

                <button
                    type="button"
                    onClick={handleClickImage}
                    className="mx-auto mb-8 block h-56 w-56 overflow-hidden rounded-md"
                >
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt="LP 썸네일"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black shadow-2xl">
                            <div className="absolute h-44 w-44 rounded-full border border-gray-800 bg-black" />
                            <div className="absolute h-28 w-28 rounded-full border border-gray-700 bg-black" />
                            <div className="absolute h-20 w-20 rounded-full bg-white" />
                            <div className="absolute h-3 w-3 rounded-full bg-[#2A2D34]" />
                        </div>
                    )}
                </button>

                <div className="flex flex-col gap-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="LP Name"
                        className="rounded-md border border-gray-500 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-pink-500"
                    />

                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="LP Content"
                        className="rounded-md border border-gray-500 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-pink-500"
                    />

                    <div className="flex gap-3">
                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="LP Tag"
                            className="flex-1 rounded-md border border-gray-500 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-pink-500"
                        />

                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="rounded-md bg-slate-400 px-6 py-3 font-bold text-white hover:bg-pink-500"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="rounded-xl border border-gray-500 px-4 py-2 text-sm hover:border-pink-500 hover:text-pink-500"
                            >
                                #{tag} <span className="ml-2">×</span>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="mt-4 rounded-md bg-pink-500 py-4 text-lg font-bold text-white disabled:bg-gray-500"
                    >
                        {isPending ? "Adding..." : "Add LP"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLpModal;