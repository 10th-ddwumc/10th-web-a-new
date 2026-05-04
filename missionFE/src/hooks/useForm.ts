import { useState, useEffect } from 'react';


interface FormValues {
  [key: string]: string;
}

const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormValues>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };


  useEffect(() => {
    const newErrors: FormValues = {};


    if (values.email && (!values.email.includes('@') || !values.email.includes('.'))) {
      newErrors.email = '유효하지 않은 이메일 형식입니다.';
    }

    if (values.password && values.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);

    const isValid = 
      values.email?.includes('@') && 
      values.email?.includes('.') && 
      values.password?.length >= 6;

    setIsFormValid(isValid);
  }, [values]);

  return { values, errors, isFormValid, handleChange };
};

export default useForm;