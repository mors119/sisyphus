import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchBar } from './search-bar';
import { useLocation } from 'react-router-dom';
import { AuthOrUserButton } from './user-button';
import { useTranslation } from 'react-i18next';

// 상단 네비게이션 바
export const Navbar = () => {
  const { setOpen } = useSidebar();
  const location = useLocation();
  const { i18n, t } = useTranslation();

  const currentPathname = location.pathname.slice(1).toUpperCase();

  // 현재 언어 상태
  const currentLang = i18n.language;

  return (
    <nav className="w-full flex justify-center border-b-1 shadow">
      <div className="h-14 flex justify-between w-full items-center p-2 gap-2 md:gap-1 md:px-4">
        <div className="p-1 flex justify-center items-center">
          <SidebarTrigger onClick={() => setOpen(!open)} />
          <div className="p-2">{currentPathname}</div>
        </div>

        {/* 검색 */}
        <SearchBar />

        <div className="flex justify-center items-center gap-2">
          {/* 언어 선택 */}
          <Select
            value={currentLang}
            onValueChange={(lang) => {
              i18n.changeLanguage(lang);
            }}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={t('lang')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>
          <AuthOrUserButton />
        </div>
      </div>
    </nav>
  );
};
