export type UserSigninformaion = {
    email: string;
    password: string;
};

function validateUser(values: UserSigninformaion) {
    const errors = {
        email: '', // 둘 빈 값이지만 에러발생시 에러메세지가 담기게됨
        password: '',
    }

    if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email,)) {
        errors.email = '이메일 형식이 올바르지 않습니다.'
    }

    //비밀번호는 8자~20자 사이
    if (!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.'
    }
    return errors;
}

//로그인 유효성 검사
function validateSignin(values: UserSigninformaion) {
    return validateUser(values);
}

export { validateSignin };