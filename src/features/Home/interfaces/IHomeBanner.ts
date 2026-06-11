export interface IHomeBannerApiItem {
  id: number;
  razaoSocial: string;
  nomeImagem: string;
  tituloImagem: string;
  urlImagem: string;
}

export interface IHomeBannerApiResponse {
  success: boolean;
  data: IHomeBannerApiItem[];
}

export interface ICarouselItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}
