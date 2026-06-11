import { useEffect, useState } from "react";
import type { IColaboradorProfissional } from "../interfaces/IColaboradorProfissional";
import { colaboradorProfissionalService } from "../services/colaboradorProfissionalService";

interface UseColaboradoresProfissionaisState {
  colaboradores: IColaboradorProfissional[];
  isLoading: boolean;
  error: string | null;
}

export function useColaboradoresProfissionais(lojaId?: number) {
  const [state, setState] = useState<UseColaboradoresProfissionaisState>({
    colaboradores: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!lojaId) {
      setState({
        colaboradores: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    let isMounted = true;

    const loadColaboradores = async () => {
      setState({
        colaboradores: [],
        isLoading: true,
        error: null,
      });

      try {
        const colaboradores =
          await colaboradorProfissionalService.getColaboradores(lojaId);

        if (!isMounted) {
          return;
        }

        setState({
          colaboradores,
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
            : "Nao foi possivel carregar os colaboradores da loja.";

        setState({
          colaboradores: [],
          isLoading: false,
          error: message,
        });
      }
    };

    void loadColaboradores();

    return () => {
      isMounted = false;
    };
  }, [lojaId]);

  return state;
}
