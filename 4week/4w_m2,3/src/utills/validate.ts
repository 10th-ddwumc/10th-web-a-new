import { z } from "zod";

export type UserSigninformaion = {
    email: string;
    password: string;
};

// 피드백 반영: 복잡한 정규식 대신 Zod 스키마 정의
const loginSchema = z.object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z.string()
        .min(8, { message: "비밀번호는 8자 이상으로 입력해주세요." })
        .max(20, { message: "비밀번호는 20자 이하로 입력해주세요." }),
});

function validateSignin(values: UserSigninformaion) {
    // 피드백 반영: 로그인 유효성 검사에도 Zod를 활용하여 로직을 단순화했습니다.
    const result = loginSchema.safeParse(values);
    const errors = { email: '', password: '' };

    if (!result.success) {
        // 발생한 에러들을 에러 객체에 매핑
        result.error.issues.forEach((err) => {
            const field = err.path[0] as keyof typeof errors;
            if (!errors[field]) { // 첫 번째 에러 메시지만 우선 저장
                errors[field] = err.message;
            }
        });
    }
    return errors;
}

export { validateSignin };

// function validateUser(values: UserSigninformaion) {
//     const errors = {
//         email: '', // 둘 빈 값이지만 에러발생시 에러메세지가 담기게됨
//         password: '',
//     }

//     if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email,)) {
//         errors.email = '이메일 형식이 올바르지 않습니다.'
//     }

//     //비밀번호는 8자~20자 사이
//     if (!(values.password.length >= 8 && values.password.length <= 20)) {
//         errors.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.'
//     }
//     return errors;
// }

// //로그인 유효성 검사
// function validateSignin(values: UserSigninformaion) {
//     return validateUser(values);
// }

