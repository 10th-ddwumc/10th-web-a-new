import { useEffect, useState } from "react";
import type { ResponseMyinfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";

const Mypage = () => {
    const [data, setData] = useState<ResponseMyinfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            const response: ResponseMyinfoDto = await getMyInfo();
            setData(response);
        };

        getData();
    }, []);

    if (!data) return <div>...</div>;

    return (
        <div>
            {data.data.name} {data.data.email}
        </div>
    );
};

export default Mypage;