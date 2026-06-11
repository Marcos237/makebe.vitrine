export interface IAgendamentoColaboradorItem {
  id: number;
  idLoja: number;
  razaoSocial?: string | null;
  idAgendaColaborador: number;
  idColaborador: number;
  nomeColaborador?: string | null;
  idServico: number;
  descricaoServico?: string | null;
  valor: number;
  idUsuario?: string | null;
  nomeUsuario?: string | null;
  data?: string | null;
  dataInicioAgendamento?: string | null;
  dataTerminoAgendamento?: string | null;
  dataInicioAgendamentoExtenso?: string | null;
  dataTerminoAgendamentoExtenso?: string | null;
  ativo: boolean;
  periodo?: number | null;
}

export interface IColaboradorAgendamentoServico {
  id: number;
  descricao?: string | null;
  valor: number;
  periodo?: number | null;
}

export interface IColaboradorAgendamento {
  id: number;
  isBloqueadoHoje?: boolean | null;
  idAgendaSemanaInicio?: number | null;
  idAgendaSemanaFim?: number | null;
  agendaAbertaInicio?: string | null;
  agendaAbertaFim?: string | null;
  agendaBloqueadaInicio?: string | null;
  agendaBloqueadaFim?: string | null;
  usuarioId?: string | null;
  dataInicioAgendamento?: string | null;
  dataTerminoAgendamento?: string | null;
  agendamentos?: IAgendamentoColaboradorItem[] | null;
  servicos?: IColaboradorAgendamentoServico[] | null;
}
