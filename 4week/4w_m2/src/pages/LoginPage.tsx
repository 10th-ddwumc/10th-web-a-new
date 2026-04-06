import { validateSignin, type UserSigninformaion } from "../utills/validate";
import useForm from "../hooks/useForm";

const LoginPage = () => {
    const { values, errors, touched, getInputProps } = useForm<UserSigninformaion>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });

    //const handleSubmit = async() => {
    const handleSubmit = () => {
        console.log(values);
        //await axios.post("url", values)
    }

    const isDisabled =
        Object.values(errors || {}).some((error) => error && error.length > 0) || //오류가 있으면 true
        Object.values(values).some((value) => value === ''); //값이 빈 문자열인 필드가 있으면 true

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    /*
                    // {...getInputProps('email')} 아래와 동일
                    value={}
                    onBlur={}
                    onChange={} 
                    */
                    name="email"
                    {...getInputProps('email')} //이메일 인풋에 필요한 속성들을 getInputProps 함수를 통해 가져와서 적용. name은 'email'로 지정하여 이메일 필드에 대한 속성들을 가져옴

                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}

                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    name="password"
                    {...getInputProps('password')}

                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : " border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}

                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button type='button' onClick={handleSubmit} disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400">
                    로그인
                </button>

            </div>
        </div>
    )
}

export default LoginPage;
