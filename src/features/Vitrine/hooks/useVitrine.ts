import { useEffect, useState } from "react";
import type { IVitrine } from "../interfaces/IVitrine";
import { vitrineService } from "../services/vitrineService";

interface UseVitrineState {
  itens: IVitrine[];
  isLoading: boolean;
  error: string | null;
}

export function useVitrine() {
  const [state, setState] = useState<UseVitrineState>({
    itens: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const carregarVitrine = async () => {
      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: null,
      }));

      try {
        const itens = await vitrineService.listar();

        if (!isMounted) {
          return;
        }

        setState({
          itens,
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
            : "Nao foi possivel carregar a vitrine.";

        setState({
          itens: [],
          isLoading: false,
          error: message,
        });
      }
    };

    void carregarVitrine();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
