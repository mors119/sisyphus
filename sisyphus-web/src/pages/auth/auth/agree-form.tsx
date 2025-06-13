import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AgreeFormProps {
  setShow: (show: string) => void;
  show: string;
  className?: string;
  onClose?: () => void;

  setIsLoading?: (isLoading: boolean) => void;
}

// 수집 이용약관 동의
export const AgreeForm = ({
  setShow,
  show,
  className,
  onClose,

  setIsLoading,
}: AgreeFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = show === '1' || show === '2';

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.(); // 외부 클릭 시 닫기
        setIsLoading?.(false); // 로딩 꺼주기
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose, setIsLoading]);

  return (
    <div
      id="agree-form"
      ref={containerRef}
      className={cn(
        'absolute left-0 top-0 z-50 bg-white border rounded-md shadow text-sm transition-all duration-500 ease-in-out',
        isVisible
          ? 'max-h-[380px] opacity-100 p-4'
          : 'max-h-0 opacity-0 p-0 pointer-events-none',
        className,
      )}
      style={{ overflow: 'hidden' }}>
      <div className="overflow-y-auto max-h-[340px]">
        {isVisible && (
          <Button
            variant="ghost"
            className="absolute right-2 top-2 p-1 "
            onClick={() => {
              setShow('0');
              setIsLoading?.(false);
            }}>
            <X />
          </Button>
        )}
        {show === '1' && (
          <>
            <h3>제1조 (목적)</h3>
            <p>
              이 약관은 <strong>[Sisyphus Academy]</strong>이 제공하는 영어
              단어장 서비스의 이용 조건 및 절차, 이용자와 회사 간의 권리·의무 및
              책임사항 등을 규정함을 목적으로 합니다.
            </p>

            <h3>제2조 (이용자의 정의)</h3>
            <ol>
              <li>
                "이용자"란 본 약관에 따라 서비스를 이용하는 모든 회원 또는
                비회원
              </li>
              <li>
                "회원"이란 서비스에 회원가입을 하고, 아이디(ID)를 부여받은 자
              </li>
            </ol>

            <h3>제3조 (약관의 효력 및 변경)</h3>
            <ol>
              <li>
                본 약관은 서비스 초기화면 또는 기타 게시판에 게시함으로써 효력이
                발생합니다.
              </li>
              <li>
                회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 약관을
                변경할 수 있습니다.
              </li>
            </ol>

            <h3>제4조 (서비스의 제공 및 변경)</h3>
            <ol>
              <li>
                회사는 이용자에게 영어 단어 저장, 복습, 검색, 태그 분류 등의
                기능을 제공합니다.
              </li>
              <li>
                서비스 내용은 회사 사정에 따라 변경될 수 있으며, 변경 시 사전
                고지합니다.
              </li>
            </ol>

            <h3>제5조 (회원의 의무)</h3>
            <ol>
              <li>
                회원은 자신의 계정 정보를 타인에게 제공하거나 공유할 수
                없습니다.
              </li>
              <li>
                회원은 서비스 이용 시 관련 법령 및 공공질서, 미풍양속을 준수해야
                합니다.
              </li>
            </ol>

            <h3>제6조 (계정 해지 및 서비스 이용 중지)</h3>
            <p>
              회사는 다음 각 호에 해당하는 경우 회원의 서비스 이용을 제한하거나
              해지할 수 있습니다.
            </p>
            <ol>
              <li>타인의 정보를 도용하거나, 서비스 운영을 방해하는 경우</li>
              <li>부정한 방법으로 서비스를 사용하는 경우</li>
            </ol>

            <h3>제7조 (면책조항)</h3>
            <p>
              회사는 무료로 제공하는 서비스에 관하여 회원에게 발생한 손해에
              대하여 책임을 지지 않습니다.
            </p>
          </>
        )}

        {show === '2' && (
          <>
            <h3>개인정보 수집 및 이용 동의서</h3>
            <p>
              <strong>[Sisyphus Academy]</strong>은 회원가입 및 서비스 제공을
              위해 아래와 같은 개인정보를 수집합니다.
            </p>

            <h3>1. 수집 항목</h3>
            <ul>
              <li>
                이메일 주소, 비밀번호 (소셜 로그인 시 해당 플랫폼의 고유 ID
                포함)
              </li>
              <li>단어 저장 및 복습 기록</li>
            </ul>

            <h3>2. 수집 목적</h3>
            <ul>
              <li>회원 식별 및 인증, 단어장 기능 제공</li>
              <li>사용자별 콘텐츠 저장 및 복원</li>
            </ul>

            <h3>3. 보유 및 이용 기간</h3>
            <p>
              회원 탈퇴 시 즉시 파기 (단, 관련 법령에 따라 일정 기간 보관될 수
              있음)
            </p>

            <h3>4. 동의를 거부할 권리 및 불이익</h3>
            <p>
              회원은 개인정보 제공에 동의하지 않을 수 있으며, 이 경우 서비스
              이용이 제한될 수 있습니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
