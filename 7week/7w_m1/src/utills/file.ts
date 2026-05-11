export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = () => {
            reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
        };

        reader.readAsDataURL(file);
    });
};