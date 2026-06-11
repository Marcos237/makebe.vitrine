export interface IColaboradorProfissional {
  id: number;
  colaboradorId: number;
  usuarioId?: string;
  nome?: string;
  lojaId: number;
  servicoId: number;
  descricaoServico?: string;
  urlImagem?: string;
  isAgendaVisible?: boolean;
}
