import { PATHS } from '@/app/router/paths.constants';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const PolicyPage = () => {
  const [show, setShow] = useState(false);
  const { i18n, t } = useTranslation();
  const [markdown, setMarkdown] = useState('');
  const navigate = useNavigate();

  // 마크다운 로딩
  useEffect(() => {
    const fileName = show ? 'terms.md' : 'policy.md';
    fetch(`/locales/${i18n.language}/${fileName}`)
      .then((res) => res.text())
      .then(setMarkdown)
      .catch(() => setMarkdown(''));
  }, [show, i18n.language]);

  if (!markdown) return <Loader />;

  return (
    <div className="p-4 min-h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <img
            src="/logo/diagram-logo.png"
            className="w-10 h-10"
            onClick={() => navigate(PATHS.HOME)}
          />
          <Button onClick={() => setShow(false)} variant="outline">
            {t('policy.title')}
          </Button>
          <Button onClick={() => setShow(true)} variant="outline">
            {t('terms')}
          </Button>
        </div>
        <Button variant="sisyphus" onClick={() => navigate(PATHS.HOME)}>
          {t('back')}
        </Button>
      </div>
      <div className="p-4 whitespace-pre-line">
        {markdown && <ReactMarkdown>{markdown}</ReactMarkdown>}
      </div>
    </div>
  );
};
export default PolicyPage;
