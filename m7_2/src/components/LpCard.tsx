
interface LpCardProps {
  lp: {
    id: number;
    thumbnail: string;
    title: string;
    createdAt: string;
    user?: { id: string };
    likesCount?: number;
  };
  onClick: (id: number) => void;
}

const LpCard = ({ lp, onClick }: LpCardProps) => {
  return (
    <div 
      onClick={() => onClick(lp.id)}
      className="cursor-pointer aspect-square relative group overflow-hidden bg-zinc-900"
    >
      <img 
        src={lp.thumbnail} 
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-10">
        <p className="font-bold text-sm text-white line-clamp-2 mb-1">{lp.title}</p>
        <p className="font-normal text-[12px] text-gray-300 mb-1">{lp.createdAt.split('T')[0]}</p>
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span>user {lp.user?.id}</span>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{lp.likesCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpCard;