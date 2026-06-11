import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { IColaboradorProfissional } from "../interfaces/IColaboradorProfissional";

const COLABORADOR_PROFISSIONAL_ENDPOINT = "/vitrine/colaborador-profissional";

interface IColaboradorProfissionalResponse {
  data: IColaboradorProfissional[];
}

export const colaboradorProfissionalService = {
  async getColaboradores(lojaId: number): Promise<IColaboradorProfissional[]> {
    try {
      const response = await baseService.get<IColaboradorProfissionalResponse>(
        COLABORADOR_PROFISSIONAL_ENDPOINT,
        {
          params: {
            lojaId,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {

        throw new Error("Nao foi possivel carregar os colaboradores da loja.");
      }

      throw error;
    }
  },
};
