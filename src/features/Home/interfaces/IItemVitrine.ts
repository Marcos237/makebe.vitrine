export interface IItemVitrine {
  id: number;
  idSessao: number;
  titulo?: string | null;
  subtitulo?: string | null;
  texto?: string | null;
  dataCadastro: string;
  status: boolean;
}
