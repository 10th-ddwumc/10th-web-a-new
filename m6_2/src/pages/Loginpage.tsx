import useForm from "../hooks/useform";
import { type UserSignInInformation, validateSignin } from "../utils/validate";
//import { useLocalstorage } from "../hooks/useLocalStorage";
//import { LOCAL_STORAGE_KEY } from "../contants/key";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const {login} = useAuth();
    // const {setItem} = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);
    const{getInputProps, errors, touched, values} = useForm<UserSignInInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
    await login(values);
    }; 

    const handleGoogleLogin = () => {
        const serverUrl = import.meta.env.VITE_SERVER_API_URL;
        window.location.href = `${serverUrl}/v1/auth/google/login`;
    };

    const isDisabled: boolean = 
    Object.values(errors||{}).some((error:string)=>error.length>0)||
    Object.values(values).some((value)=>value==="");

    return (
        <div className=" flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                {...getInputProps("email")}
                name="email" 
                className={`border border-[#ccc] w-75 p-2.5 focus:border-[#f2f2f2f2] rounded-sm
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                
                type={"email"}
                placeholder={"이메일"}
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input 
                {...getInputProps("password")}
                className="border border-[#ccc] w-75 p-2.5 focus:border-[#f2f2f2f2] rounded-sm" 
                type={"password"}
                placeholder={"비밀번호"}
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
                로그인
                </button>
                <button
                onClick={handleGoogleLogin}
                disabled={isDisabled}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-md text-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                <img src=".\src\google.png" alt="구글 로고" className="w-6 h-auto" />
                <span>구글 로그인</span>
            </button>
            </div>
        </div>
    )
};

export default LoginPage;