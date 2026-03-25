export const LoadingSpinner = () => {
  return (
    <div
      className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"
      role="status"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};
