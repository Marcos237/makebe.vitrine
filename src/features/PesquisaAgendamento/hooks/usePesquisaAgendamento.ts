import { useCallback, useState } from "react";
import type { IPesquisaAgendamentoItem } from "../interfaces/IPesquisaAgendamentoItem";
import { pesquisaAgendamentoService } from "../services/pesquisaAgendamentoService";

interface IUsePesquisaAgendamentoState {
  resultados: IPesquisaAgendamentoItem[];
  isLoading: boolean;
  error: string | null;
  searchedTerm: string;
  hasSearched: boolean;
}

export function usePesquisaAgendamento() {
  const [state, setState] = useState<IUsePesquisaAgendamentoState>({
    resultados: [],
    isLoading: false,
    error: null,
    searchedTerm: "",
    hasSearched: false,
  });

  const pesquisar = useCallback(async (termo: string) => {
    const normalizedTerm = termo.trim();

    if (!normalizedTerm) {
      setState({
        resultados: [],
        isLoading: false,
        error: null,
        searchedTerm: "",
        hasSearched: false,
      });
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
      searchedTerm: normalizedTerm,
      hasSearched: true,
    }));

    try {
      const resultados = await pesquisaAgendamentoService.pesquisar(normalizedTerm);

      setState({
        resultados,
        isLoading: false,
        error: null,
        searchedTerm: normalizedTerm,
        hasSearched: true,
      });
    } catch (error) {
      setState({
        resultados: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel realizar a pesquisa. Tente novamente.",
        searchedTerm: normalizedTerm,
        hasSearched: true,
      });
    }
  }, []);

  return {
    ...state,
    pesquisar,
  };
}
