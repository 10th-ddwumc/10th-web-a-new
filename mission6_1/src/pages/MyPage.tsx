import { useEffect, useState } from "react";
import type { ResponseMyinfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext"; 

const Mypage = () => {
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyinfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            const response: ResponseMyinfoDto = await getMyInfo();
            setData(response);
        };

        getData();
    }, []);

    const handleLogout = async() => {
        await logout();
    };

    return (
        <div>
            <h1>{data?.data?.name}님 환영합니다.</h1> 
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Mypage;