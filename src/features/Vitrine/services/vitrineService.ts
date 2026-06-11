import { AxiosError } from "axios";
import { vitrineMock } from "../../../mocks/vitrineMock";
import { baseService } from "../../../services/baseService";
import type { IVitrine } from "../interfaces/IVitrine";

const VITRINE_ENDPOINT = "/vitrine";

export const vitrineService = {
  async listar(): Promise<IVitrine[]> {
    try {
      const response = await baseService.get<IVitrine[]>(VITRINE_ENDPOINT);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && !error.response) {
        return vitrineMock;
      }

      throw new Error("Nao foi possivel carregar a vitrine.");
    }
  },
};
