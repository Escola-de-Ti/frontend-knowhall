const AT = 'kh_token';
const RT = 'kh_refresh';

export const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem(AT, access);
  if (refresh) localStorage.setItem(RT, refresh);
};
export const getAccessToken = () => localStorage.getItem(AT);
export const getRefreshToken = () => localStorage.getItem(RT);
export const clearTokens = () => { localStorage.removeItem(AT); localStorage.removeItem(RT); };