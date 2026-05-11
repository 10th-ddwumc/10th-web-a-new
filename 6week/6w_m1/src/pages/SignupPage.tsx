import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상으로 입력해주세요." }).max(20, { message: "비밀번호는 20자 이하로 입력해주세요." }),
    passwordCheck: z.string().min(8, { message: "비밀번호 확인은 8자 이상으로 입력해주세요." }).max(20, { message: "비밀번호 확인은 20자 이하로 입력해주세요." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." })
}).refine((data) => data.password === data.passwordCheck, { //일치하지 않을때의 조건을 적어야함
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordCheck"], // 오류 메시지를 passwordCheck 필드에 표시
})

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    // 단계별 입력을 위한 상태 (1: 이메일, 2: 비밀번호, 3: 닉네임)
    const [step, setStep] = useState(1);
    // 비밀번호 보이기/숨기기 상태
    const [showPw, setShowPw] = useState(false);
    const [showPwCheck, setShowPwCheck] = useState(false);

    const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(schema),
        mode: "onChange", // 실시간으로 유효성을 검사하여 버튼 활성화 여부 판단
    })

    // 입력값 실시간 모니터링
    const emailValue = watch("email");
    const passwordValue = watch("password");
    const passwordCheckValue = watch("passwordCheck");
    const nameValue = watch("name");

    // '다음' 버튼 클릭 시 해당 단계의 유효성 검사 후 통과하면 다음 단계로
    const handleNextStep = async () => {
        let fieldToValidate: (keyof FormFields)[] = [];
        if (step === 1) fieldToValidate = ["email"];
        if (step === 2) fieldToValidate = ["password", "passwordCheck"];

        const isValid = await trigger(fieldToValidate);
        if (isValid) setStep(step + 1);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { passwordCheck, ...rest } = data; // passwordCheck 제외하고 전송
            await postSignup(rest);
            alert("회원가입이 완료되었습니다!");
            navigate("/"); // 홈으로 이동
        } catch (error) {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const getButtonStyle = (isDisabled: boolean) =>
        `w-full py-3 rounded-md text-lg font-medium transition-colors ${isDisabled
            ? "bg-gray-400 text-black cursor-not-allowed"
            : "bg-pink-500 text-black hover:opacity-90 cursor-pointer"
        }`;
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-[350px] bg-white p-10 rounded-2xl shadow-xl relative">
                {/* 이전 단계로 돌아가기 버튼 */}
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="absolute left-5 top-10 text-black text-lg cursor-pointer"
                    >
                        👈
                    </button>
                )}

                <h2 className="text-black text-center text-2xl mb-8 font-bold">회원가입</h2>

                <div className="flex flex-col gap-6">
                    {/* 1단계: 이메일 입력 */}
                    {step === 1 && (
                        <>
                            <div className="border-b border-gray-500 py-2">
                                <input
                                    {...register('email')}
                                    className="bg-transparent text-black w-full outline-none placeholder:text-gray-500"
                                    type="text"
                                    placeholder="이메일을 입력해주세요"
                                />
                            </div>
                            {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}

                            <button
                                type='button'
                                onClick={handleNextStep}
                                disabled={!!errors.email || !emailValue}
                                className={getButtonStyle(!!errors.email || !emailValue)}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {/* 2단계: 비밀번호 설정 */}
                    {step === 2 && (
                        <>
                            {/* 상단에 입력했던 이메일 표시 */}
                            <div className="text-gray-400 text-sm mb-[-10px]">{emailValue}</div>

                            <div className="relative border-b border-gray-500 py-2">
                                <input
                                    {...register('password')}
                                    className="bg-transparent text-black w-full outline-none pr-10"
                                    type={showPw ? "text" : "password"}
                                    placeholder="비밀번호 (8자 이상)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-0 top-2 text-xs text-gray-400"
                                >
                                    {showPw ? "숨기기" : "표시"}
                                </button>
                            </div>
                            {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}

                            <div className="relative border-b border-gray-500 py-2">
                                <input
                                    {...register('passwordCheck')}
                                    className="bg-transparent text-black w-full outline-none pr-10"
                                    type={showPwCheck ? "text" : "password"}
                                    placeholder="비밀번호 확인"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwCheck(!showPwCheck)}
                                    className="absolute right-0 top-2 text-xs text-gray-400"
                                >
                                    {showPwCheck ? "숨기기" : "표시"}
                                </button>
                            </div>
                            {errors.passwordCheck && <div className="text-red-500 text-xs">{errors.passwordCheck.message}</div>}

                            <button
                                type='button'
                                onClick={handleNextStep}
                                disabled={!!errors.password || !!errors.passwordCheck || !passwordValue}
                                className={getButtonStyle(!!errors.password || !!errors.passwordCheck || !passwordValue)}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {/* 3단계: 닉네임 설정 및 완료 */}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-6">
                            {/* 프로필 이미지 UI (회색 원으로 간단히 구현) */}
                            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                            </div>

                            <div className="w-full border-b border-gray-500 py-2">
                                <input
                                    {...register('name')}
                                    className="bg-transparent text-black w-full outline-none text-center"
                                    type="text"
                                    placeholder="사용하실 닉네임을 입력하세요"
                                />
                            </div>
                            {errors.name && <div className="text-red-500 text-xs">{errors.name.message}</div>}

                            <button
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || !nameValue}
                                className={getButtonStyle(isSubmitting || !nameValue)}
                            >
                                회원가입 완료
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    /*return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    
                    // {...getInputProps('email')} 아래와 동일
                    //value={}
                    //onBlur={}
                    //onChange={} 
                    
                    {...register('email')} //이메일 인풋에 필요한 속성들을 getInputProps 함수를 통해 가져와서 적용. name은 'email'로 지정하여 이메일 필드에 대한 속성들을 가져옴
                    name="email"
                    // {...getInputProps('email')} //이메일 인풋에 필요한 속성들을 getInputProps 함수를 통해 가져와서 적용. name은 'email'로 지정하여 이메일 필드에 대한 속성들을 가져옴
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"text"}
                    placeholder={"이메일"}
                />
                {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email.message}</div>
                )}

                <input
                    {...register('password')}
                    name="password"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.password ? "border-red-500 bg-red-200" : " border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password.message}</div>
                )}


                <input
                    {...register('passwordCheck')}
                    name="passwordCheck"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.passwordCheck ? "border-red-500 bg-red-200" : " border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호 확인"}
                />
                {errors.passwordCheck && (
                    <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
                )}


                <input
                    {...register('name')}
                    name="name"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.name ? "border-red-500 bg-red-200" : " border-gray-300"}`}
                    type={"text"}
                    placeholder={"이름"}
                />
                {errors.name && (
                    <div className="text-red-500 text-sm">{errors.name.message}</div>
                )}

                <button type='button' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400">
                    회원가입
                </button>

            </div>
        </div>
    )*/
}

export default SignupPage;