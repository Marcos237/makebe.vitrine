import { useEffect, useState } from "react";
import type { ILojaVitrine } from "../interfaces/ILojaVitrine";
import { vitrineLojaService } from "../services/vitrineLojaService";

interface UseVitrineLojaState {
  lojas: ILojaVitrine[];
  isLoading: boolean;
  error: string | null;
}

export function useVitrineLoja() {
  const [state, setState] = useState<UseVitrineLojaState>({
    lojas: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadLojas = async () => {
      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: null,
      }));

      try {
        const lojas = await vitrineLojaService.getLoja();

        if (!isMounted) {
          return;
        }

        setState({
          lojas,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar a vitrine da loja.";

        setState({
          lojas: [],
          isLoading: false,
          error: message,
        });
      }
    };

    void loadLojas();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
