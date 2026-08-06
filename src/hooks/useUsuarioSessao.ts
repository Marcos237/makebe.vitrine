import { useEffect, useState } from "react";
import { API_BASE_SESSAO_URL, resolveApiKey } from "../config/apiConfig";

const SESSION_USER_ENDPOINT = "UsuarioSessao";

interface UsuarioSessao {
  id?: string;
  nome?: string;
}

export function useUsuarioSessao() {
  const [usuarioSessao, setUsuarioSessao] = useState<UsuarioSessao | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsuarioSessao = async () => {
      try {
        const response = await fetch(`${API_BASE_SESSAO_URL}${SESSION_USER_ENDPOINT}`, {
          credentials: "include",
          headers: {
            ApiKey: resolveApiKey(API_BASE_SESSAO_URL),
          },
        });

        if (!response.ok) {
          if (isMounted) {
            setUsuarioSessao(null);
          }

          return;
        }

        const payload = (await response.json()) as UsuarioSessao | null;

        if (isMounted) {
          setUsuarioSessao(payload ?? null);
        }
      } catch {
        if (isMounted) {
          setUsuarioSessao(null);
        }
      }
    };

    void loadUsuarioSessao();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isAuthenticated: Boolean(usuarioSessao?.id),
    usuarioSessao,
  };
}
