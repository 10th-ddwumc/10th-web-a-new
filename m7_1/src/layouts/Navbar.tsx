import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { logout: clearAuthContext } = useAuth();

    const { mutate: logoutMutate, isPending } = useMutation({
        mutationFn: postLogout,
        onSuccess: () => {
            clearAuthContext();
        },
        onError: () => {
            alert("로그아웃 중 오류가 발생했습니다. 강제 로그아웃 합니다.");
            clearAuthContext();
        }
    });

    return (
        <nav>
            <button 
                onClick={() => logoutMutate()} 
                disabled={isPending}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 disabled:opacity-50"
            >
                {isPending ? "로그아웃 중..." : "로그아웃"}
            </button>
        </nav>
    );
};

export default Navbar;