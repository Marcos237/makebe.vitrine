import { AxiosError } from "axios";
import { baseService } from "../../../services/baseService";
import type {
  ICarouselItem,
  IHomeBannerApiItem,
} from "../interfaces/IHomeBanner";
import type { IContatoVitrine } from "../interfaces/IContatoVitrine";
import type { IItemVitrine } from "../interfaces/IItemVitrine";
import type { IServicoVitrine } from "../interfaces/IServicoVitrine";

const HOME_BANNER_ENDPOINT = "/vitrine/loja";
const HOME_BANNER_TIPO = "banner";
const ITEM_VITRINE_ENDPOINT = "/api/ItemVitrine";
const SERVICOS_VITRINE_ENDPOINT = "/api/ServicosVitrine";
const CONTATO_VITRINE_ENDPOINT = "/api/ContatoVitrine";

interface IHomeBannerDataResponse {
  data: IHomeBannerApiItem[];
}

type HomeBannerResponse =
  | IHomeBannerApiItem[]
  | IHomeBannerDataResponse
  | {
      success: boolean;
      data: IHomeBannerApiItem[];
    };

interface IItemVitrineResponse {
  success: boolean;
  data: IItemVitrine[];
}

interface IServicoVitrineResponse {
  success: boolean;
  data: IServicoVitrine[];
}

type ContatoVitrineResponse =
  | IContatoVitrine[]
  | {
      success: boolean;
      data: IContatoVitrine[];
    };

function mapBannerToCarouselItem(item: IHomeBannerApiItem): ICarouselItem {
  return {
    id: String(item.id),
    title: item.tituloImagem,
    subtitle: item.razaoSocial,
    imageUrl: item.urlImagem,
  };
}

function extractBannerItems(responseData: HomeBannerResponse): IHomeBannerApiItem[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if ("data" in responseData && Array.isArray(responseData.data)) {
    return responseData.data;
  }

  return [];
}

export const homeService = {
  async getCarouselItems(): Promise<ICarouselItem[]> {
    try {
      const response = await baseService.get<HomeBannerResponse>(
        HOME_BANNER_ENDPOINT,
        {
          params: {
            Tipo: HOME_BANNER_TIPO,
          },
        },
      );

      const items = extractBannerItems(response.data);
      if (items.length === 0) {
        throw new Error("A API retornou uma resposta invalida para os banners.");
      }

      return items.map(mapBannerToCarouselItem);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os banners da vitrine.");
      }

      throw error;
    }
  },
  async getItemVitrine(): Promise<IItemVitrine[]> {
    try {
      const response = await baseService.get<IItemVitrineResponse>(ITEM_VITRINE_ENDPOINT);

      return response.data.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os dados da home.");
      }

      throw error;
    }
  },
  async getServicosVitrine(): Promise<IServicoVitrine[]> {
    try {
      const response = await baseService.get<IServicoVitrineResponse>(
        SERVICOS_VITRINE_ENDPOINT,
      );

      return response.data.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os servicos da vitrine.");
      }

      throw error;
    }
  },
  async getContatoVitrine(): Promise<IContatoVitrine[]> {
    try {
      const response = await baseService.get<ContatoVitrineResponse>(
        CONTATO_VITRINE_ENDPOINT,
      );

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return response.data.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Nao foi possivel carregar os contatos da vitrine.");
      }

      throw error;
    }
  },
};
