//export const API_BASE_URL = "https://www.makebeapp.com.br/api/makebe-vitrine/";
// export const API_BASE_SESSAO_URL = "https://www.makebeapp.com.br/api/makebe-session/";

export const API_BASE_URL = "https://localhost:44340/";
// export const API_BASE_URL= "https://makebeappdev/api/makebe-vitrine/"
export const API_BASE_SESSAO_URL = "https://makebeappdev/api/makebe-session/";
export const LOGIN_URL = `${new URL(API_BASE_URL).origin}/login`;
export const URL_IMAGENS = "https://www.makebeapp.com.br/imagens";

export const VITRINE_API_KEY = "be925bd5-dee8-413b-904b-521e67cb6371";
export const SESSAO_API_KEY = "684b3b6f-e7e3-4763-918f-2de3ec05f306";

export function resolveApiKey(requestUrl?: string) {
  if (!requestUrl) {
    return VITRINE_API_KEY;
  }

  const normalizedUrl = requestUrl.toLowerCase();

  if (normalizedUrl.includes("session") || normalizedUrl.includes("sessao")) {
    return SESSAO_API_KEY;
  }

  return VITRINE_API_KEY;
}
