import { validateSignin, type UserSigninformaion } from "../utills/validate";
import useForm from "../hooks/useForm";
import { useCallback, useEffect } from "react"; // useCallback 임포트
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate("/my");
        }
    }, [accessToken, navigate]);
    //const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    // 피드백 반영: validate 함수가 렌더링 때마다 생성되어 useForm의 useEffect를 
    // 불필요하게 실행하지 않도록 useCallback으로 메모이제이션합니다.
    const memoizedValidate = useCallback((values: UserSigninformaion) => {
        return validateSignin(values);
    }, []);

    const { values, errors, touched, getInputProps } = useForm<UserSigninformaion>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: memoizedValidate, // 메모이제이션된 함수 전달
    });
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    //const handleSubmit = async() => {
    const handleSubmit = async () => {
        await login(values);
        //navigate("/my");

        // console.log(values);
        // try {
        //     const response = await postSignin(values);
        //     setItem(response.data.accessToken);
        //     console.log(response);
        // } catch (error) {
        //     if (error instanceof Error) {
        //         alert(error.message);
        //     } else {
        //         alert("로그인 중 알 수 없는 오류가 발생했습니다.");
        //     }
        // }
        // //await axios.post("url", values)
        navigate(from, { replace: true }); // 원래 목적지로 이동[cite: 20]
    }

    const hadleGoogleLogin = () => {
        //구글 로그인 로직 구현
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    const isDisabled =
        Object.values(errors || {}).some((error) => error && error.length > 0) || //오류가 있으면 true
        Object.values(values).some((value) => value === ''); //값이 빈 문자열인 필드가 있으면 true

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-[350px] bg-white p-10 rounded-2xl shadow-xl">
                <h2 className="text-black text-center text-2xl mb-8 font-bold">
                    로그인
                </h2>

                <div className="flex flex-col gap-6">
                    <div className="border-b border-gray-500 py-2">
                        <input
                            name="email"
                            {...getInputProps('email')}
                            className="bg-transparent text-black w-full outline-none placeholder:text-gray-500"
                            type="email"
                            placeholder="이메일"
                        />
                    </div>

                    {errors?.email && touched?.email && (
                        <div className="text-red-500 text-xs mt-[-15px]">
                            {errors.email}
                        </div>
                    )}

                    <div className="border-b border-gray-500 py-2">
                        <input
                            name="password"
                            {...getInputProps('password')}
                            className="bg-transparent text-black w-full outline-none placeholder:text-gray-500"
                            type="password"
                            placeholder="비밀번호"
                        />
                    </div>

                    {errors?.password && touched?.password && (
                        <div className="text-red-500 text-xs mt-[-15px]">
                            {errors.password}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className={`w-full py-3 rounded-md text-lg font-medium transition-colors ${isDisabled
                            ? "bg-gray-400 text-black cursor-not-allowed"
                            : "bg-pink-500 text-black hover:opacity-90 cursor-pointer"
                            }`}
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        onClick={hadleGoogleLogin}
                        className={`w-full py-3 rounded-md text-lg font-medium transition-colors `}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <img src={"/images/google.svg"} alt="Google Icon" className="w-7 h-7" />
                            <span>Google 로그인</span>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    )
}

export default LoginPage;