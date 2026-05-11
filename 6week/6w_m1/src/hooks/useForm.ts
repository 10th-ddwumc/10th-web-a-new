import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValues: T; //{email: '', password: ''} 이런식으로 객체 형태로 받을거임. T는 객체 형태의 제네릭이 될거임.
    // 값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>; //T에 대한 유효성 검사 함수를 받을거임.. T는 객체이므로 Record로 키는 T의 키, 값은 string으로 받음
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState(initialValues)
    const [touched, setTouched] = useState<Record<string, boolean>>({}); //각 필드가 터치되었는지 여부를 저장하는 상태. 초기값은 빈 객체로 설정
    const [errors, setErrors] = useState<Record<string, string>>({}); //각 필드의 에러 메시지를 저장하는 상태. 초기값은 T의 키를 가지는 빈 객체로 설정

    //사용자가 입력값을 바꿀때 실행되는 함수. name은 필드의 이름, text는 입력된 값
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, // 불변성 유지(기존 값 유지)
            [name]: text
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true, //해당 필드가 터치되었다고 표시
        });
    };

    //이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps = (name: keyof T) => {
        return {
            value: values[name],
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleChange(name, e.target.value),
            onBlur: () => handleBlur(name),
        };
    }
    //value가 변경될 때 마다 에러 검증 로직이 실행됨
    //{email: ''}
    useEffect(() => {
        const newErrors = validate(values); //현재 입력값에 대한 유효성 검사 실행
        setErrors(newErrors);//검증 결과를 errors 상태에 저장, 오류메세지 업뎃

    }, [values, validate]);
    return { values, errors, touched, getInputProps };

}

export default useForm;