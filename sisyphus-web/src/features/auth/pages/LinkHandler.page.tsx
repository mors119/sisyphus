import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '@/app/router/paths.constants';

const LinkHandlerPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const state = params.get('state');

    navigate('/' + PATHS.USER + `?state=${state}`);
  }, [navigate, params]);

  return null;
};

export default LinkHandlerPage;
