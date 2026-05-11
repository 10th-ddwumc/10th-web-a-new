import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImageIcon, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePatchMyInfo from "../hooks/mutations/usePatchMyInfo";
import { fileToDataUrl } from "../utills/file";
import type { RequestUpdateMyInfoDto } from "../types/auth";
import { getLpList } from "../apis/ip";
import { QUERY_KEY } from "../constants/key";
import type { Lp } from "../types/lp";
import LpCard from "../components/LpCard/LpCard";

const MyPage = () => {
    const { accessToken } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, isLoading, isError } = useGetMyInfo(accessToken);
    const { mutate: patchMyInfoMutate, isPending } = usePatchMyInfo();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");

    // 수정: 내가 좋아요 한 LP / 내가 작성한 LP 탭 상태
    const [activeTab, setActiveTab] = useState<"liked" | "created">("liked");

    // 수정: 마이페이지 LP 정렬 상태
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (!data?.data) return;

        setName(data.data.name ?? "");
        setBio(data.data.bio ?? "");
        setAvatar(data.data.avatar ?? "");
    }, [data]);

    const myId = data?.data.id;

    // 수정: 마이페이지 하단에 보여줄 LP 목록 조회
    const { data: lpListData } = useQuery({
        queryKey: [QUERY_KEY.lps, "mypage", order],
        queryFn: () =>
            getLpList({
                cursor: 0,
                limit: 50,
                order,
            } as any),
        enabled: !!myId,
    });

    const allLps: Lp[] = useMemo(() => {
        const rawData = lpListData?.data;

        if (!rawData) return [];

        if (Array.isArray(rawData)) {
            return rawData;
        }

        if (Array.isArray(rawData.data)) {
            return rawData.data;
        }

        return [];
    }, [lpListData]);

    const likedLps = useMemo(() => {
        if (!myId) return [];

        return allLps.filter((lp) =>
            lp.likes?.some((like) => like.userId === myId),
        );
    }, [allLps, myId]);

    const createdLps = useMemo(() => {
        if (!myId) return [];

        return allLps.filter(
            (lp) => lp.authorId === myId || lp.author?.id === myId,
        );
    }, [allLps, myId]);

    const visibleLps = activeTab === "liked" ? likedLps : createdLps;

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
        <div className="mx-auto max-w-7xl pt-24 text-white">
            <section className="mx-auto flex max-w-4xl items-center justify-center gap-10">
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
            </section>

            <section className="mt-16 border-t border-gray-700 pt-0">
                <div className="mx-auto flex max-w-lg justify-center">
                    <button
                        type="button"
                        onClick={() => setActiveTab("liked")}
                        className={`border-t-2 px-10 py-5 text-xl font-bold ${activeTab === "liked"
                            ? "border-white text-white"
                            : "border-transparent text-gray-600"
                            }`}
                    >
                        내가 좋아요 한 LP
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("created")}
                        className={`border-t-2 px-10 py-5 text-xl font-bold ${activeTab === "created"
                            ? "border-white text-white"
                            : "border-transparent text-gray-600"
                            }`}
                    >
                        내가 작성한 LP
                    </button>
                </div>

                <div className="mb-8 flex justify-end">
                    <div className="flex overflow-hidden rounded-md border border-white">
                        <button
                            type="button"
                            onClick={() => setOrder("asc")}
                            className={`px-6 py-3 text-lg font-bold ${order === "asc"
                                ? "bg-white text-black"
                                : "bg-black text-white"
                                }`}
                        >
                            오래된순
                        </button>

                        <button
                            type="button"
                            onClick={() => setOrder("desc")}
                            className={`px-6 py-3 text-lg font-bold ${order === "desc"
                                ? "bg-white text-black"
                                : "bg-black text-white"
                                }`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                {visibleLps.length > 0 ? (
                    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {visibleLps.map((lp) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-xl text-gray-500">
                        {activeTab === "liked"
                            ? "좋아요 한 LP가 없습니다."
                            : "작성한 LP가 없습니다."}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyPage;