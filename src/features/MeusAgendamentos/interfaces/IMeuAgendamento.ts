export interface IMeuAgendamento {
  id: number;
  idUsuario?: string | null;
  dataInicioAgendamento: string;
  dataTerminoAgendamento: string;
  descricaoServico?: string | null;
  idColaborador: number;
  idColaboradorUsuario?: string | null;
  nomeColaborador?: string | null;
  ehDesativado: boolean;
}
