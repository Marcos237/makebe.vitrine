import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { IPesquisaAgendamentoItem } from "../interfaces/IPesquisaAgendamentoItem";

const PESQUISA_AGENDAMENTO_ENDPOINT = "/vitrine/pesquisa";

interface IPesquisaAgendamentoApiItem {
  razaoSocial?: string | null;
  RazaoSocial?: string | null;
  descricaoCategoria?: string | null;
  DescricaoCategoria?: string | null;
  urlImagem?: string | null;
  UrlImagem?: string | null;
  idLoja?: number;
  IdLoja?: number;
}

interface IPesquisaAgendamentoResponse {
  data?: IPesquisaAgendamentoApiItem[] | null;
}

function normalizePesquisaItem(
  item: IPesquisaAgendamentoApiItem,
): IPesquisaAgendamentoItem {
  return {
    razaoSocial: item.razaoSocial ?? item.RazaoSocial ?? null,
    descricaoCategoria: item.descricaoCategoria ?? item.DescricaoCategoria ?? null,
    urlImagem: item.urlImagem ?? item.UrlImagem ?? null,
    idLoja: item.idLoja ?? item.IdLoja ?? 0,
  };
}

export const pesquisaAgendamentoService = {
  async pesquisar(termo: string): Promise<IPesquisaAgendamentoItem[]> {
    try {
      const response = await baseService.get<IPesquisaAgendamentoResponse>(
        PESQUISA_AGENDAMENTO_ENDPOINT,
        {
          params: {
            termo,
          },
        },
      );

      return (response.data.data ?? []).map(normalizePesquisaItem);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel realizar a pesquisa. Tente novamente.");
      }

      throw error;
    }
  },
};
