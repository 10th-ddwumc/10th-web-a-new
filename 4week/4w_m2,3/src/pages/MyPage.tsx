import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setdata] = useState<ResponseMyInfoDto | null>(null);
    // 피드백 반영: 에러 발생 시 사용자에게 메시지를 보여주기 위한 에러 상태 추가
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setdata(response);
            } catch (e: any) {
                // 피드백 반영: 에러 발생 시 콘솔뿐만 아니라 상태 업데이트 및 팝업창(alert)으로 사용자에게 알림
                const message = e.response?.data?.message || "내 정보 불러오기 실패";
                setError(message);
                alert(message);
                console.error("내 정보 불러오기 실패:", e);
            }
        }
        getData();
    }, []);

    // 피드백 반영: 에러 상태일 때 로딩 창 대신 에러 메시지를 렌더링함
    if (error) return <div className="text-red-500 text-center mt-10 font-bold">{error}</div>;

    if (!data) return <div className="text-center mt-10">로딩 중...</div>;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
            <h1 className="text-xl font-bold">마이페이지</h1>
            <div className="border p-4 rounded-md shadow-sm">
                <p><strong>이름:</strong> {data.data.name}</p>
                <p><strong>이메일:</strong> {data.data.email}</p>
                <img src={data.data?.avatar as string} alt={"구글로고"} />
                <button className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    )
}

export default MyPage;