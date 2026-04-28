// src/App.tsx
import { useState } from 'react';
import { api } from './api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. 회원가입
  const handleSignUp = async () => {
    try {
      await api.post('/auth/signup', { email, password, name: "테스터" });
      alert("회원가입 성공!");
    } catch (e) { alert("회원가입 실패"); }
  };

  // 2. 로그인
  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/signin', { email, password });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      alert("로그인 성공! (30초 뒤 토큰이 만료됩니다)");
    } catch (e) { alert("로그인 실패"); }
  };

  // 3. 데이터 요청 (테스트 버튼)
  const testApi = async () => {
    try {
      const { data } = await api.get('/users/me');
      alert(`성공! 이름: ${data.data.name}`);
    } catch (e) { alert("인증 실패 또는 리프레시 실패"); }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>인증 테스트 랩 🧪</h2>
      <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={handleSignUp}>회원가입</button>
      <button onClick={handleLogin}>로그인</button>
      <hr />
      <button onClick={testApi} style={{ padding: '10px', background: 'gold' }}>
        데이터 가져오기 (30초 뒤에 눌러보세요!)
      </button>
    </div>
  );
}
export default App;