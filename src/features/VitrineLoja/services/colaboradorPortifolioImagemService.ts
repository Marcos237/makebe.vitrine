import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { IColaboradorPortifolioImagem } from "../interfaces/IColaboradorPortifolioImagem";

const COLABORADOR_PORTIFOLIO_IMAGEM_ENDPOINT = "/vitrine/colaborador-portifolio-imagem";

interface IColaboradorPortifolioImagemEnvelope {
  success?: boolean;
  message?: string | null;
  data: IColaboradorPortifolioImagem[];
  notifications?: unknown;
  datas?: unknown;
  retorno?: boolean;
}

export const colaboradorPortifolioImagemService = {
  async getImagens(colaboradorId: number): Promise<IColaboradorPortifolioImagem[]> {
    try {
      const response = await baseService.get<IColaboradorPortifolioImagemEnvelope>(
        COLABORADOR_PORTIFOLIO_IMAGEM_ENDPOINT,
        {
          params: {
            id: colaboradorId,
          },
        },
      );

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar o portifolio do colaborador.");
      }

      throw error;
    }
  },
};
