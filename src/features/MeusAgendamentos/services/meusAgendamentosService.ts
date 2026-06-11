import { AxiosError } from "axios";
import type { IMeuAgendamento } from "../interfaces/IMeuAgendamento";
import { baseService } from "../../../services/baseService";

const MEUS_AGENDAMENTOS_ENDPOINT = "/vitrine/colaborador-agendamento/meus-agendamentos";
const DESATIVAR_AGENDAMENTO_ENDPOINT = "/vitrine/colaborador-agendamento/desativar";

export interface IPaginacao<T> {
  quantidadePagina: number;
  totalPaginas: number;
  total: number;
  paginaAtual: number;
  registroInicial: number;
  objetos: T[];
}

interface IMeuAgendamentoApiItem {
  id?: number;
  Id?: number;
  idUsuario?: string | null;
  IdUsuario?: string | null;
  dataInicioAgendamento?: string;
  DataInicioAgendamento?: string;
  dataTerminoAgendamento?: string;
  DataTerminoAgendamento?: string;
  descricaoServico?: string | null;
  DescricaoServico?: string | null;
  idColaborador?: number;
  IdColaborador?: number;
  idColaboradorUsuario?: string | null;
  IdColaboradorUsuario?: string | null;
  nomeColaborador?: string | null;
  NomeColaborador?: string | null;
  ehDesativado?: boolean;
  EhDesativado?: boolean;
}

interface IPaginacaoApi<T> {
  quantidadePagina?: number;
  QuantidadePagina?: number;
  totalPaginas?: number;
  TotalPaginas?: number;
  total?: number;
  Total?: number;
  paginaAtual?: number;
  PaginaAtual?: number;
  registroInicial?: number;
  RegistroInicial?: number;
  objetos?: T[];
  Objetos?: T[];
}

interface IMeuAgendamentoResponse {
  data: IPaginacaoApi<IMeuAgendamentoApiItem>;
}

interface IDesativarAgendamentoRequest {
  id: number;
}

interface IDesativarAgendamentoResponse {
  data: unknown;
}

function normalizeMeuAgendamento(item: IMeuAgendamentoApiItem): IMeuAgendamento {
  return {
    id: item.id ?? item.Id ?? 0,
    idUsuario: item.idUsuario ?? item.IdUsuario ?? null,
    dataInicioAgendamento:
      item.dataInicioAgendamento ?? item.DataInicioAgendamento ?? "",
    dataTerminoAgendamento:
      item.dataTerminoAgendamento ?? item.DataTerminoAgendamento ?? "",
    descricaoServico: item.descricaoServico ?? item.DescricaoServico ?? null,
    idColaborador: item.idColaborador ?? item.IdColaborador ?? 0,
    idColaboradorUsuario:
      item.idColaboradorUsuario ?? item.IdColaboradorUsuario ?? null,
    nomeColaborador: item.nomeColaborador ?? item.NomeColaborador ?? null,
    ehDesativado: item.ehDesativado ?? item.EhDesativado ?? false,
  };
}

function normalizePaginacao(
  item?: IPaginacaoApi<IMeuAgendamentoApiItem> | null,
): IPaginacao<IMeuAgendamento> {
  const objetos = item?.objetos ?? item?.Objetos ?? [];

  return {
    quantidadePagina: item?.quantidadePagina ?? item?.QuantidadePagina ?? 10,
    totalPaginas: item?.totalPaginas ?? item?.TotalPaginas ?? 1,
    total: item?.total ?? item?.Total ?? 0,
    paginaAtual: item?.paginaAtual ?? item?.PaginaAtual ?? 1,
    registroInicial: item?.registroInicial ?? item?.RegistroInicial ?? 1,
    objetos: objetos.map(normalizeMeuAgendamento),
  };
}

export const meusAgendamentosService = {
  async listar(params?: {
    paginaAtual?: number;
    quantidadePagina?: number;
  }): Promise<IPaginacao<IMeuAgendamento>> {
    try {
      const response = await baseService.get<IMeuAgendamentoResponse>(
        MEUS_AGENDAMENTOS_ENDPOINT,
        {
          params: {
            paginaAtual: params?.paginaAtual ?? 1,
            quantidadePagina: params?.quantidadePagina ?? 10,
          },
        },
      );

      return normalizePaginacao(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os agendamentos.");
      }

      throw error;
    }
  },

  async desativar(request: IDesativarAgendamentoRequest): Promise<unknown> {
    try {
      const response = await baseService.post<IDesativarAgendamentoResponse>(
        DESATIVAR_AGENDAMENTO_ENDPOINT,
        request,
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel excluir o agendamento.");
      }

      throw error;
    }
  },
};
