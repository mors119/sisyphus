import axios from 'axios';

/**
 * accessToken을 axios에 등록해서 이후 요청에서 자동으로 Authorization 헤더 포함
 * @param token - JWT access token (예: 'eyJhbGciOiJIUzI1NiIsInR...')
 */
export function initAccessToken(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
