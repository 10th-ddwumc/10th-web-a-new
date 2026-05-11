import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useform";
import { type UserSignInInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { postSignin } from "../apis/auth";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { getInputProps, errors, touched, values } = useForm<UserSignInInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: (body: UserSignInInformation) => postSignin(body),
        onSuccess: (data) => {
            login(data);
            alert("로그인 성공");
            navigate("/");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "로그인 정보가 일치하지 않습니다.");
        }
    });

    const handleSubmit = () => {
        loginMutate(values);
    };

    const handleGoogleLogin = () => {
        const serverUrl = import.meta.env.VITE_SERVER_API_URL;
        window.location.href = `${serverUrl}/v1/auth/google/login`;
    };

    const isDisabled: boolean = 
        Object.values(errors || {}).some((error: string) => error.length > 0) ||
        Object.values(values).some((value) => value === "") ||
        isPending;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    className={`border border-[#ccc] w-75 p-2.5 focus:border-[#f2f2f2f2] rounded-sm
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type="email"
                    placeholder="이메일"
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps("password")}
                    className="border border-[#ccc] w-75 p-2.5 focus:border-[#f2f2f2f2] rounded-sm"
                    type="password"
                    placeholder="비밀번호"
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    {isPending ? "로그인 중..." : "로그인"}
                </button>
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-md text-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <img src="/src/google.png" alt="구글 로고" className="w-6 h-auto" />
                    <span>구글 로그인</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;