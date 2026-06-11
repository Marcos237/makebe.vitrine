export interface IServicoVitrine {
  id: number;
  titulo?: string | null;
  subtitulo?: string | null;
  texto?: string | null;
  categoria?: string | null;
  urlImagem?: string | null;
  dataCadastro: string;
  status: boolean;
}
