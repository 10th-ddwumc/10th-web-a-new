import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseMyinfoDto } from "../types/auth";
import { getMyInfo, patchMyInfo, type RequestUpdateUserDto } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};
const Mypage = () => {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [data, setData] = useState<ResponseMyinfoDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editForm, setEditForm] = useState<RequestUpdateUserDto>({
        name: "",
        bio: "",
        avatar: ""
    });

    const fetchUserData = async () => {
        try {
            const response: ResponseMyinfoDto = await getMyInfo();
            setData(response);
            setEditForm({
                name: response.data.name,
                bio: response.data.bio || "",
                avatar: response.data.avatar || ""
            });
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const { mutate: updateProfile } = useMutation({
        mutationFn: (formData: FormData) => patchMyInfo(formData),
        onSuccess: () => {
            alert("프로필이 성공적으로 수정되었습니다. 로그아웃 후 다시 로그인 해주세요");
            setIsEditing(false);
            setSelectedFile(null); 
            fetchUserData();
            queryClient.invalidateQueries({ queryKey: ["userMe"] }); 
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "수정에 실패했습니다.");
        }
    });

    const handleSave = async () => {
        let avatarData = editForm.avatar; 

        if (selectedFile) {
            avatarData = await convertToBase64(selectedFile);
        }
        const jsonBody = {
            name: editForm.name,
            bio: editForm.bio || "",
            avatar: avatarData 
        };
        console.log("JSON 데이터 전송:", jsonBody);
        updateProfile(jsonBody as any);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-zinc-900 text-white rounded-xl">
            {!isEditing ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-700 flex items-center justify-center overflow-hidden">
                        {data?.data?.avatar ? (
                            <img 
                                src={data.data.avatar} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-zinc-500 text-sm">No Image</span>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{data?.data?.name}</h1>
                        <p className="text-zinc-400 mt-2">{data?.data?.bio || "등록된 소개글이 없습니다."}</p>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition">
                            수정하기
                        </button>
                        <button onClick={() => logout()} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
                            로그아웃
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-zinc-800 pb-4">프로필 설정</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">이름</label>
                            <input 
                                type="text"
                                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none"
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">자기소개 (Bio)</label>
                            <textarea 
                                className="w-full p-3 bg-zinc-800 rounded-lg h-24 focus:outline-none"
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">프로필 사진</label>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-zinc-700 rounded-lg text-sm">
                                    파일 선택
                                </button>
                                <span className="text-xs text-zinc-500">{selectedFile ? selectedFile.name : "선택된 파일 없음"}</span>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={handleSave} className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold transition">저장하기</button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">취소</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mypage;