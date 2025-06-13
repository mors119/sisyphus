import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    chrome.storage.local.get('selectedWord', (result) => {
      if (result.selectedWord) {
        setWord(result.selectedWord);
      }
    });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!meaning.trim()) {
      setError('뜻을 입력해주세요.');
      return;
    }

    setError('');

    // 백엔드로 전송할 준비
    const payload = { word, meaning };
    console.log('서버로 전송할 데이터:', payload);

    // 예시: 서버 요청 (비동기)
    fetch('https://localhost:8080/api/note/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // 초기화
    setMeaning('');
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="title">단어 등록</h2>

      <div className="field">
        <label>단어</label>
        <div className="readonly-box">{word || '단어 없음'}</div>
      </div>

      <div className="field">
        <label htmlFor="meaning">뜻</label>
        <input
          id="meaning"
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="뜻을 입력하세요"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="save-button">
        저장
      </button>
    </form>
  );
}
export default App;
