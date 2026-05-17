import useSidebar from '../hooks/useSidebar';

const menuItems = [
  { icon: '🏠', label: 'Home' },
  { icon: '📰', label: '뉴스' },
  { icon: '👤', label: '프로필' },
  { icon: '⚙️', label: '설정' },
  { icon: '📞', label: '고객센터' },
];

const Sidebar = () => {
  const { isOpen, open, close } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-950 border-b border-gray-800 flex items-center px-6 z-50">
        {/* 햄버거 버튼 */}
        <button
          onClick={open}
          className="flex flex-col justify-center gap-1.5 w-8 h-8"
          aria-label="메뉴 열기"
        >
          <span className="block h-0.5 w-6 bg-white transition-all duration-300 hover:bg-pink-500" />
          <span className="block h-0.5 w-6 bg-white transition-all duration-300 hover:bg-pink-500" />
          <span className="block h-0.5 w-6 bg-white transition-all duration-300 hover:bg-pink-500" />
        </button>

        <h1 className="ml-4 text-lg font-black">
          🍔 햄버거 메뉴
        </h1>
      </header>

      {/* 딤 배경 */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-800">
          <span className="font-bold text-lg">메뉴</span>
          <button
            onClick={close}
            className="text-gray-400 hover:text-white transition-colors text-xl"
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={close}
              className="flex items-center gap-4 px-4 py-3 rounded-xl
                text-gray-300 hover:text-white hover:bg-gray-800
                transition-all duration-200 text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 로그아웃 */}
        <div className="px-4 py-6 border-t border-gray-800">
          <button
            onClick={close}
            className="flex items-center gap-4 px-4 py-3 rounded-xl w-full
              text-gray-500 hover:text-red-400 hover:bg-gray-800
              transition-all duration-200 text-left"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
     <main className="pt-16 flex flex-col items-center min-h-screen gap-4 text-gray-500">
  <p className="text-sm">햄버거 버튼을 눌러보세요</p>
  {Array.from({ length: 50 }).map((_, i) => (
    <p key={i} className="text-gray-600">스크롤 테스트용 텍스트 {i + 1}</p>
  ))}
</main>
    </div>
  );
};

export default Sidebar;