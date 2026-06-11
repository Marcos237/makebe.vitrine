import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { IColaboradorAgendamento } from "../interfaces/IColaboradorAgendamento";

const COLABORADOR_AGENDAMENTO_ENDPOINT = "/vitrine/colaborador-agendamento";
const PERIODOS_DISPONIVEIS_ENDPOINT =
  "/vitrine/colaborador-agendamento/periodos-disponiveis";

interface IColaboradorAgendamentoResponse {
  data: IColaboradorAgendamento[];
}

export interface IPeriodoDisponivelAgendamento {
  inicio?: string | null;
  fim?: string | null;
  isAgendado?: boolean | null;
}

interface IPeriodoDisponivelAgendamentoResponse {
  data: IPeriodoDisponivelAgendamento[];
}

interface IAgendamentoPersistenciaRequest {
  idServico: number;
  idColaborador: number;
  dataInicioAgendamento: string;
}

interface IAgendamentoPersistenciaResponse {
  data: unknown;
}

export const colaboradorAgendamentoService = {
  async getAgenda(colaboradorId: number): Promise<IColaboradorAgendamento[]> {
    try {
      const response = await baseService.get<IColaboradorAgendamentoResponse>(
        COLABORADOR_AGENDAMENTO_ENDPOINT,
        {
          params: {
            colaboradorId,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar a agenda do colaborador.");
      }

      throw error;
    }
  },

  async getPeriodosDisponiveis(params: {
    codigoServico: number;
    codigoColaboradorId: number;
    dataEscolhida: string;
  }): Promise<IPeriodoDisponivelAgendamento[]> {
    try {
      const response = await baseService.get<IPeriodoDisponivelAgendamentoResponse>(
        PERIODOS_DISPONIVEIS_ENDPOINT,
        {
          params,
        },
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os horarios disponiveis.");
      }

      throw error;
    }
  },

  async persistirAgendamento(
    request: IAgendamentoPersistenciaRequest,
  ): Promise<unknown> {
    try {
      const response = await baseService.post<IAgendamentoPersistenciaResponse>(
        COLABORADOR_AGENDAMENTO_ENDPOINT,
        request,
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel concluir o agendamento.");
      }

      throw error;
    }
  },
};
