import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
    const [data, setdata] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setdata(response);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
            }
        }
        getData();
    }, []);

    if (!data) return <div>로딩 중...</div>;

    return (

        <div>{data.data.name} {data.data.email}</div>
    )
}

export default MyPage;