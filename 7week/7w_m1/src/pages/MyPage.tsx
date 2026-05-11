import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePatchMyInfo from "../hooks/mutations/usePatchMyInfo";
import { fileToDataUrl } from "../utills/file";
import type { RequestUpdateMyInfoDto } from "../types/auth";

const MyPage = () => {
    const { accessToken } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, isLoading, isError } = useGetMyInfo(accessToken);
    const { mutate: patchMyInfoMutate, isPending } = usePatchMyInfo();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (!data?.data) return;

        setName(data.data.name ?? "");
        setBio(data.data.bio ?? "");
        setAvatar(data.data.avatar ?? "");
    }, [data]);

    const handleClickAvatar = () => {
        if (!isEditing) return;
        fileInputRef.current?.click();
    };

    const handleChangeAvatar = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const previewUrl = await fileToDataUrl(file);
        setAvatar(previewUrl);
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert("이름은 비워둘 수 없습니다.");
            return;
        }

        // 수정: avatar가 빈 문자열이면 서버에 보내지 않음
        // 이유: 서버가 avatar를 URL 형식으로 검사할 경우 "" 때문에 실패할 수 있음
        const body: RequestUpdateMyInfoDto = {
            name: name.trim(),
            bio,
        };

        if (avatar.trim()) {
            body.avatar = avatar;
        }

        patchMyInfoMutate(body, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    if (isLoading) {
        return <div className="mt-24 text-center text-white">로딩 중...</div>;
    }

    if (isError || !data?.data) {
        return (
            <div className="mt-24 text-center font-bold text-red-500">
                내 정보 불러오기 실패
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl pt-28 text-white">
            <div className="flex items-center gap-10">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeAvatar}
                />

                <button
                    type="button"
                    onClick={handleClickAvatar}
                    className="relative h-52 w-52 overflow-hidden rounded-full bg-gray-300"
                >
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="프로필 이미지"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-500">
                            <ImageIcon size={52} />
                        </div>
                    )}

                    {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <ImageIcon size={42} />
                        </div>
                    )}
                </button>

                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border border-white bg-transparent px-4 py-3 text-3xl font-bold outline-none"
                            />
                        ) : (
                            <h1 className="text-4xl font-bold">
                                {data.data.name}
                            </h1>
                        )}

                        {isEditing ? (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isPending}
                                className="text-white hover:text-pink-500 disabled:opacity-50"
                            >
                                <Check size={36} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="text-gray-400 hover:text-pink-500"
                            >
                                <Settings size={26} />
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Bio를 입력해주세요"
                            className="min-h-16 w-full resize-none rounded-md border border-white bg-transparent px-4 py-3 text-2xl outline-none"
                        />
                    ) : (
                        <p className="text-2xl text-gray-300">
                            {data.data.bio || "소개글이 없습니다."}
                        </p>
                    )}

                    <p className="text-2xl font-bold">{data.data.email}</p>
                </div>
            </div>
        </div>
    );
};

export default MyPage;