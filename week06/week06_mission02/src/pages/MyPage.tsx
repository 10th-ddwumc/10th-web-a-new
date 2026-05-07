import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!data) return <div className="p-8 text-white">로딩 중...</div>;

  return (
    <div className="p-8 text-white">
      <h1>{data.data?.name}님 환영합니다.</h1>
      {data.data?.avatar && (
        <img
          src={data.data.avatar as string}
          alt="avatar"
          className="w-16 h-16 rounded-full my-4"
        />
      )}
      <p>{data.data?.email}</p>
      <button
        className="cursor-pointer bg-[#e11d48] rounded-lg px-4 py-2 mt-4 hover:bg-[#be123c] transition"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
