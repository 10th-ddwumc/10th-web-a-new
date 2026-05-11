import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
    lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
    const navigate = useNavigate();
    const uploadDate = new Date(lp.createdAt).toLocaleDateString();

    return (
        <div
            // App.tsx의 ProtectedLayout 안에 있는 path: "lp/:lpid"와 맞춤
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="group relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg bg-[#1a1a1a]"
        >
            <img
                src={lp.thumbnail}
                alt={lp.title}
                className="object-cover w-full h-64 md:h-80 block"
            />

            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="text-white">
                    <h3 className="text-lg font-bold truncate">
                        {lp.title}
                    </h3>

                    <p className="text-xs text-gray-300 mb-2">
                        {uploadDate}
                    </p>

                    <div className="flex items-center gap-1 text-sm">
                        <span>❤️ {lp.likes?.length || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LpCard;