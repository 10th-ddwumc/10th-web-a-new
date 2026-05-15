import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";

const signupSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  passwordCheck: z.string(),
  name: z.string().min(1, "닉네임을 입력해주세요."),
}).refine((data) => data.password === data.passwordCheck, {
  path: ["passwordCheck"],
  message: "비밀번호가 일치하지 않습니다.",
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const { passwordCheck, ...submitData } = data;
      await postSignup(submitData);
      navigate("/login");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleNext = async (fields: (keyof SignupFormValues)[]) => {
    const isStepValid = await trigger(fields);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>회원가입</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>이메일 주소를 입력해주세요</label>
            <input 
              {...register("email")} 
              placeholder="example@email.com" 
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
            />
            {errors.email && <p style={{ color: "#ff4d4f", fontSize: "13px", margin: 0 }}>{errors.email.message}</p>}
            <button 
              type="button" 
              disabled={!!errors.email || !watch("email")} 
              onClick={() => handleNext(["email"])}
              style={{ 
                padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer",
                backgroundColor: (!errors.email && watch("email")) ? "#007bff" : "#e0e0e0",
                color: "white"
              }}
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "14px", color: "#666" }}>입력한 이메일: <strong>{watch("email")}</strong></p>
            
            <label style={{ fontSize: "14px", fontWeight: "600" }}>비밀번호를 설정해주세요</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                {...register("password")}
                placeholder="비밀번호 (8자 이상)"
                style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#007bff" }}
              >
                {showPw ? "숨기기" : "보기"}
              </button>
            </div>
            {errors.password && <p style={{ color: "#ff4d4f", fontSize: "13px", margin: 0 }}>{errors.password.message}</p>}

            <input
              type="password"
              {...register("passwordCheck")}
              placeholder="비밀번호 재확인"
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
            />
            {errors.passwordCheck && <p style={{ color: "#ff4d4f", fontSize: "13px", margin: 0 }}>{errors.passwordCheck.message}</p>}

            <button 
              type="button" 
              disabled={!!errors.password || !!errors.passwordCheck || !watch("passwordCheck")} 
              onClick={() => handleNext(["password", "passwordCheck"])}
              style={{ 
                padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer",
                backgroundColor: (!errors.password && !errors.passwordCheck && watch("passwordCheck")) ? "#007bff" : "#e0e0e0",
                color: "white", marginTop: "10px"
              }}
            >
              다음
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <label style={{ fontSize: "14px", fontWeight: "600" }}>닉네임을 입력해주세요</label>
            <input 
              {...register("name")} 
              placeholder="닉네임" 
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
            />
            {errors.name && <p style={{ color: "#ff4d4f", fontSize: "13px", margin: 0 }}>{errors.name.message}</p>}
            
            <button 
              type="submit" 
              disabled={!isValid}
              style={{ 
                padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer",
                backgroundColor: isValid ? "#28a745" : "#e0e0e0",
                color: "white", marginTop: "10px"
              }}
            >
              회원가입 완료
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignupPage;