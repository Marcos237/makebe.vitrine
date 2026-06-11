import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { ILojaVitrine } from "../interfaces/ILojaVitrine";

const VITRINE_LOJA_ENDPOINT = "/vitrine/loja";
const VITRINE_LOJA_TIPO = "vitrine";

interface IVitrineLojaResponse {
  data: ILojaVitrine[];
}

export const vitrineLojaService = {
  async getLoja(): Promise<ILojaVitrine[]> {
    try {
      const response = await baseService.get<IVitrineLojaResponse>(
        VITRINE_LOJA_ENDPOINT,
        {
          params: {
            Tipo: VITRINE_LOJA_TIPO,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar a vitrine da loja.");
      }

      throw error;
    }
  },
};
