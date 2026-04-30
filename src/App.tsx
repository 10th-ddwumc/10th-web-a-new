// src/App.tsx
import { useState, useEffect } from 'react';
import { api } from './api';
import googleLogo from './assets/googleLogo.png';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userName, setUserName] = useState('');      // 사용자 이름 관리

  useEffect(() => {
    // 1. URL 주소창에서 토큰 낚아채기 (구글 로그인 콜백 처리)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('accessToken');
    const urlRefresh = params.get('refreshToken');
    const urlName = params.get('name');

    if (urlToken && urlRefresh) {
      localStorage.setItem("accessToken", urlToken);
      localStorage.setItem("refreshToken", urlRefresh);
      
      // 주소창 지우기 (깔끔하게!)
      window.history.replaceState({}, document.title, "/");
      
      setIsLoggedIn(true);
      setUserName(urlName || '구글 사용자');
      alert("구글 로그인 성공!");
      return;
    }

    // 2. 이미 로그인되어 있는지 로컬 스토리지 확인
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setIsLoggedIn(true);
      // 유저 정보 가져오기 시도
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUserName(data.data.name);
    } catch (e) {
      handleLogout(); // 에러 나면 로그아웃 처리
    }
  };

  const handleSignUp = async () => {
    try {
      await api.post('/auth/signup', { email, password, name: "테스터" });
      alert("회원가입 성공!");
    } catch (e) { alert("회원가입 실패"); }
  };

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/signin', { email, password });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      setIsLoggedIn(true);
      setUserName(data.data.name);
      alert("로그인 성공!");
    } catch (e) { alert("로그인 실패"); }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    alert("로그아웃 되었습니다.");
  };

  //로그인 상태에 따라 다른 화면을 보여줍니다.
  if (isLoggedIn) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>로그인 완료</h2>
        <p>환영합니다, <strong>{userName}</strong>님!</p>
        <button onClick={async () => {
          try {
            const { data } = await api.get('/users/me');
            alert(`내 정보 가져오기 성공! 이름: ${data.data.name}`);
          } catch (e) { alert("인증 실패"); }
        }} style={{ padding: '10px', background: 'gold', marginBottom: '10px' }}>
          내 정보 다시 확인하기
        </button>
        <br />
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>로그인페이지</h2>
      <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={handleSignUp}>회원가입</button>
      <button onClick={handleLogin}>로그인</button>
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleGoogleLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 16px', cursor: 'pointer', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
          <img src={googleLogo} width="18" alt="google" />
          구글로 로그인하기
        </button>
      </div>
    </div>
  );
}

export default App;