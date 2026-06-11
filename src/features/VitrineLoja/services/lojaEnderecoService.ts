import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type { ILojaEndereco } from "../interfaces/ILojaEndereco";

const LOJA_ENDERECO_ENDPOINT = "/vitrine/loja-endereco";

interface ILojaEnderecoResponse {
  data: ILojaEndereco[];
}

export const lojaEnderecoService = {
  async getByLojaId(lojaId: number): Promise<ILojaEndereco | null> {
    try {
      const response = await baseService.get<ILojaEnderecoResponse>(
        LOJA_ENDERECO_ENDPOINT,
        {
          params: {
            Id: lojaId,
          },
        },
      );

      return response.data.data[0] ?? null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os dados da loja.");
      }

      throw error;
    }
  },
};
