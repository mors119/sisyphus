import './styles/app.css';
import Footer from './Footer';
import Header from './Header';
import ContentPage from './MainContent.page';
import { initAccessToken } from './lib/initAccessToken.utils';

function App() {
  // 앱 진입 시 store에 storage 값 담기
  initAccessToken();

  // TODO: translation 작성
  // TODO: wxt.config.ts 도 translation 가능한지 확인
  // TODO: apple oauth 추가
  return (
    <div>
      <Header />
      <ContentPage />
      <Footer />
    </div>
  );
}
export default App;
