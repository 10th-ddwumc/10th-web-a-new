import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  console.log(data?.data?.name);
  return <div>{data?.data?.name}</div>;
};

export default MyPage;
