import useForm from "../hooks/useform";
import { type UserSignInInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {

    const{getInputProps, errors, touched, values} = useForm<UserSignInInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = () => {
    try {
        const response = await axios.post("https://api.example.com/login", values);
        
        localStorage.setItem("token", response.data.token);
        navigate("/"); 
    } catch (error) {
        alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
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
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#f2f2f2f2] rounded-sm
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
                className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#f2f2f2f2] rounded-sm" 
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
            </div>
        </div>
    )
};

export default LoginPage;