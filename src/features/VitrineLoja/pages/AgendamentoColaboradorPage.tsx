import { useEffect, useMemo, useRef, useState } from "react";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUsuarioSessao } from "../../../hooks/useUsuarioSessao";
import { LOGIN_URL } from "../../../config/apiConfig";
import { useColaboradoresProfissionais } from "../hooks/useColaboradoresProfissionais";
import type { IColaboradorPortifolioImagem } from "../interfaces/IColaboradorPortifolioImagem";
import type {
  IAgendamentoColaboradorItem,
  IColaboradorAgendamento,
  IColaboradorAgendamentoServico,
} from "../interfaces/IColaboradorAgendamento";
import {
  colaboradorAgendamentoService,
  type IPeriodoDisponivelAgendamento,
} from "../services/colaboradorAgendamentoService";
import { colaboradorPortifolioImagemService } from "../services/colaboradorPortifolioImagemService";
import styles from "../styles/AgendamentoColaboradorPage.module.css";

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const TIME_SLOTS_PAGE_SIZE = 30;
const DEFAULT_VISIBLE_HOUR = "09:00";

interface ITimeSlotState {
  hora: string;
  bloqueado: boolean;
  ocupado: boolean;
}

function buildMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingEmptyDays = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const days = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function buildAgendaLink(lojaId: number, colaboradorId: number) {
  return `/colaboradorVitrine/${lojaId}/${colaboradorId}`;
}

function normalizeDate(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function parseApiDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/,
  );

  if (!match) {
    const fallbackDate = new Date(value);

    if (Number.isNaN(fallbackDate.getTime())) {
      return null;
    }

    return normalizeDate(fallbackDate);
  }

  const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] = match;
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function parseDateTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const brMatch = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/,
  );

  if (brMatch) {
    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] = brMatch;
    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    );

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  const fallbackDate = new Date(value);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatRequestDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function formatRequestDateTime(date: Date, time: string) {
  return `${formatRequestDate(date)}T${time}:00`;
}

function buildMockHourlySlots() {
  const slots: ITimeSlotState[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    slots.push({
      hora: `${String(hour).padStart(2, "0")}:00`,
      bloqueado: false,
      ocupado: false,
    });
  }

  return slots;
}

function resolvePeriodoDisponivelHora(periodo: IPeriodoDisponivelAgendamento) {
  const startDate = parseDateTime(periodo.inicio);

  return startDate ? formatTime(startDate) : null;
}

function cloneDate(date: Date) {
  return new Date(date.getTime());
}

function decimalHoursToMinutes(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  const [hoursPart, minutesPart = "00"] = value.toFixed(2).split(".");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes >= 60
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function addMinutes(date: Date, minutes: number) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes, 0, 0);
  return result;
}

function setTimeFromSource(baseDate: Date, source: Date) {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds(),
  );
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
    0,
    0,
    0,
    0,
  );
}

function isSameDay(left: Date, right: Date) {
  return normalizeDate(left).getTime() === normalizeDate(right).getTime();
}

function isDateWithinRange(
  date: Date,
  start?: string | null,
  end?: string | null,
) {
  const normalizedDate = normalizeDate(date).getTime();
  const startDate = parseApiDate(start);
  const endDate = parseApiDate(end);

  if (!startDate || !endDate) {
    return false;
  }

  return normalizedDate >= startDate.getTime() && normalizedDate <= endDate.getTime();
}

function isDateAvailable(date: Date, agendas: IColaboradorAgendamento[]) {
  return agendas.some((agenda) =>
    isDateWithinRange(date, agenda.agendaAbertaInicio, agenda.agendaAbertaFim),
  );
}

function isDateBlocked(date: Date, agendas: IColaboradorAgendamento[]) {
  const isToday =
    normalizeDate(date).getTime() === normalizeDate(new Date()).getTime();

  return agendas.some((agenda) => isToday && agenda.isBloqueadoHoje);
}

function getAgendaWeekdayId(date: Date) {
  return date.getDay() + 1;
}

function isWeekdayWithinAgenda(
  weekdayId: number,
  start?: number | null,
  end?: number | null,
) {
  if (!start || !end) {
    return true;
  }

  if (start <= end) {
    return weekdayId >= start && weekdayId <= end;
  }

  return weekdayId >= start || weekdayId <= end;
}

function isDateOutsideAgendaWeek(date: Date, agendas: IColaboradorAgendamento[]) {
  const weekdayId = getAgendaWeekdayId(date);

  return agendas.every(
    (agenda) =>
      !isWeekdayWithinAgenda(
        weekdayId,
        agenda.idAgendaSemanaInicio,
        agenda.idAgendaSemanaFim,
      ),
  );
}

function getNestedAgendamentos(agendas: IColaboradorAgendamento[]) {
  return agendas.flatMap((agenda) => agenda.agendamentos ?? []);
}

function getServicos(agendas: IColaboradorAgendamento[]) {
  const servicos = agendas.flatMap((agenda) => agenda.servicos ?? []);
  const uniqueServicos = new Map<number, IColaboradorAgendamentoServico>();

  servicos.forEach((servico) => {
    if (!uniqueServicos.has(servico.id)) {
      uniqueServicos.set(servico.id, servico);
    }
  });

  return Array.from(uniqueServicos.values());
}

function hasAgendamentoOnDate(
  date: Date,
  agendamentos: IAgendamentoColaboradorItem[],
) {
  const normalizedDate = normalizeDate(date).getTime();

  return agendamentos.some((agendamento) => {
    const startDate = parseDateTime(agendamento.dataInicioAgendamento);
    return startDate ? normalizeDate(startDate).getTime() === normalizedDate : false;
  });
}

function getAgendasForDate(date: Date, agendas: IColaboradorAgendamento[]) {
  return agendas.filter((agenda) => {
    const isAvailable = isDateWithinRange(
      date,
      agenda.agendaAbertaInicio,
      agenda.agendaAbertaFim,
    );

    if (!isAvailable) {
      return false;
    }

    return !(isSameDay(date, new Date()) && agenda.isBloqueadoHoje);
  });
}

function getAgendaDayWindow(date: Date, agenda: IColaboradorAgendamento) {
  const openStart = parseDateTime(agenda.agendaAbertaInicio);
  const openEnd = parseDateTime(agenda.agendaAbertaFim);

  if (!openStart || !openEnd) {
    return null;
  }

  const start = setTimeFromSource(date, openStart);
  const endFromAgenda = setTimeFromSource(date, openEnd);

  if (!isSameDay(openStart, openEnd)) {
    return {
      start,
      end: endFromAgenda > start ? endFromAgenda : endOfDay(date),
    };
  }

  const end = endFromAgenda;

  if (end <= start) {
    return {
      start,
      end: endOfDay(date),
    };
  }

  return { start, end };
}

function doesIntervalOverlap(
  start: Date,
  end: Date,
  rangeStart?: Date | null,
  rangeEnd?: Date | null,
) {
  if (!rangeStart || !rangeEnd) {
    return false;
  }

  return start < rangeEnd && end > rangeStart;
}

function isSlotBlocked(
  slotStart: Date,
  slotEnd: Date,
  agendas: IColaboradorAgendamento[],
) {
  return agendas.some((agenda) => {
    if (isSameDay(slotStart, new Date()) && agenda.isBloqueadoHoje) {
      return true;
    }

    const blockedStart = parseDateTime(agenda.agendaBloqueadaInicio);
    const blockedEnd = parseDateTime(agenda.agendaBloqueadaFim);

    return doesIntervalOverlap(slotStart, slotEnd, blockedStart, blockedEnd);
  });
}

function isSlotBooked(
  slotStart: Date,
  slotEnd: Date,
  agendamentos: IAgendamentoColaboradorItem[],
) {
  return agendamentos.some((agendamento) => {
    const startDate = parseDateTime(agendamento.dataInicioAgendamento);
    const endDate = parseDateTime(agendamento.dataTerminoAgendamento);

    if (!startDate || !endDate || !isSameDay(startDate, slotStart)) {
      return false;
    }

    const slotStartTime = slotStart.getTime();
    const slotEndTime = slotEnd.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return slotStartTime <= endTime && slotEndTime > startTime;
  });
}

function buildTimeSlotsForDate(
  date: Date,
  agendas: IColaboradorAgendamento[],
  agendamentos: IAgendamentoColaboradorItem[],
  periodo?: number | null,
) {
  const slotDurationInMinutes = decimalHoursToMinutes(periodo);

  if (!slotDurationInMinutes) {
    return [];
  }

  const dayAgendas = getAgendasForDate(date, agendas);
  const slotMap = new Map<string, ITimeSlotState>();

  const registerSlot = (slotStart: Date, forceAvailable = false) => {
    const slotEnd = addMinutes(slotStart, slotDurationInMinutes);
    const hora = formatTime(slotStart);
    const bloqueado = isSlotBlocked(slotStart, slotEnd, agendas);
    const ocupado =
      forceAvailable ? false : (!bloqueado && isSlotBooked(slotStart, slotEnd, agendamentos));
    const previous = slotMap.get(hora);

    slotMap.set(hora, {
      hora,
      bloqueado: previous?.bloqueado ?? bloqueado,
      ocupado: previous?.bloqueado ? previous.ocupado : (previous?.ocupado ?? ocupado),
    });
  };

  dayAgendas.forEach((agenda) => {
    const dayWindow = getAgendaDayWindow(date, agenda);

    if (!dayWindow) {
      return;
    }

    let cursor = dayWindow.start;
    const limit = dayWindow.end;

    while (cursor <= limit) {
      registerSlot(cursor);

      cursor = addMinutes(cursor, slotDurationInMinutes);
    }
  });

  return Array.from(slotMap.values()).sort((left, right) =>
    left.hora.localeCompare(right.hora),
  );
}

export function AgendamentoColaboradorPage() {
  const { lojaId = "", colaboradorId = "" } = useParams();
  const numericLojaId = Number(lojaId);
  const numericColaboradorId = Number(colaboradorId);
  const navigate = useNavigate();
  const [portifolioImagens, setPortifolioImagens] = useState<IColaboradorPortifolioImagem[]>([]);
  const [agendas, setAgendas] = useState<IColaboradorAgendamento[]>([]);
  const [agendaError, setAgendaError] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [availablePeriods, setAvailablePeriods] = useState<IPeriodoDisponivelAgendamento[]>([]);
  const [availablePeriodsError, setAvailablePeriodsError] = useState<string | null>(null);
  const [hasLoadedAvailablePeriods, setHasLoadedAvailablePeriods] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeSectionRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated } = useUsuarioSessao();
  const { colaboradores, isLoading, error } =
    useColaboradoresProfissionais(Number.isNaN(numericLojaId) ? undefined : numericLojaId);
  const [timeSlotsOffset, setTimeSlotsOffset] = useState(0);

  const colaborador = colaboradores.find(
    (item) => item.colaboradorId === numericColaboradorId,
  );

  useEffect(() => {
    let isMounted = true;

    const loadPortifolioImagens = async () => {
      if (Number.isNaN(numericColaboradorId)) {
        setPortifolioImagens([]);
        return;
      }

      try {
        const response =
          await colaboradorPortifolioImagemService.getImagens(numericColaboradorId);

        if (!isMounted) {
          return;
        }

        setPortifolioImagens(response);
      } catch {
        if (isMounted) {
          setPortifolioImagens([]);
        }
      }
    };

    void loadPortifolioImagens();

    return () => {
      isMounted = false;
    };
  }, [numericColaboradorId]);

  useEffect(() => {
    let isMounted = true;

    const loadAgenda = async () => {
      if (Number.isNaN(numericColaboradorId)) {
        setAgendas([]);
        setAgendaError(null);
        return;
      }

      try {
        const response = await colaboradorAgendamentoService.getAgenda(numericColaboradorId);

        if (!isMounted) {
          return;
        }

        setAgendas(response);
        setAgendaError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setAgendas([]);
        setAgendaError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar a agenda do colaborador.",
        );
      }
    };

    void loadAgenda();

    return () => {
      isMounted = false;
    };
  }, [numericColaboradorId]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const currentDateIsAvailable = isDateAvailable(selectedDate, agendas);
    const currentDateIsBlocked = isDateBlocked(selectedDate, agendas);
    const currentDateIsOutsideAgendaWeek = isDateOutsideAgendaWeek(
      selectedDate,
      agendas,
    );

    if (!currentDateIsAvailable || currentDateIsBlocked || currentDateIsOutsideAgendaWeek) {
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedServiceId("");
      setTimeSlotsOffset(0);
    }
  }, [agendas, selectedDate]);

  useEffect(() => {
    let isMounted = true;

    const loadPeriodosDisponiveis = async () => {
      if (
        !selectedDate ||
        !selectedServiceId ||
        Number.isNaN(numericColaboradorId)
      ) {
        setAvailablePeriods([]);
        setAvailablePeriodsError(null);
        setHasLoadedAvailablePeriods(false);
        return;
      }

      try {
        const response = await colaboradorAgendamentoService.getPeriodosDisponiveis({
          codigoServico: Number(selectedServiceId),
          codigoColaboradorId: numericColaboradorId,
          dataEscolhida: formatRequestDate(selectedDate),
        });

        if (!isMounted) {
          return;
        }

        setAvailablePeriods(response);
        setAvailablePeriodsError(null);
        setHasLoadedAvailablePeriods(true);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setAvailablePeriods([]);
        setAvailablePeriodsError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar os horarios disponiveis.",
        );
        setHasLoadedAvailablePeriods(true);
      }
    };

    void loadPeriodosDisponiveis();

    return () => {
      isMounted = false;
    };
  }, [numericColaboradorId, selectedDate, selectedServiceId]);

  useEffect(() => {
    if (!selectedDate || !timeSectionRef.current) {
      return;
    }

    timeSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedDate]);

  const principalImagem = portifolioImagens[0]?.urlImagem ?? colaborador?.urlImagem;
  const principalTitulo =
    portifolioImagens[0]?.tituloImagem ?? colaborador?.nome ?? "Profissional";
  const monthDays = useMemo(() => buildMonthDays(calendarDate), [calendarDate]);
  const agendamentos = useMemo(() => getNestedAgendamentos(agendas), [agendas]);
  const servicos = useMemo(() => getServicos(agendas), [agendas]);
  const selectedService = useMemo(
    () => servicos.find((servico) => String(servico.id) === selectedServiceId) ?? null,
    [selectedServiceId, servicos],
  );
  const selectedDateAgendas = useMemo(
    () => (selectedDate ? getAgendasForDate(selectedDate, agendas) : []),
    [agendas, selectedDate],
  );
  const isSelectedDateEnabled = useMemo(() => {
    if (!selectedDate) {
      return false;
    }

    const isAvailable = isDateAvailable(selectedDate, agendas);
    const isBlocked = isDateBlocked(selectedDate, agendas);
    const isOutsideAgendaWeek = isDateOutsideAgendaWeek(selectedDate, agendas);

    return isAvailable && !isBlocked && !isOutsideAgendaWeek;
  }, [agendas, selectedDate]);
  const timeSlotStates = useMemo(
    () =>
      isSelectedDateEnabled && selectedDate
        ? buildTimeSlotsForDate(
            selectedDate,
            selectedDateAgendas,
            agendamentos,
            selectedService?.periodo ?? null,
          )
        : [],
    [agendamentos, selectedDate, selectedDateAgendas, selectedService],
  );
  const availableTimeSlotStates = useMemo(() => {
    const slots = availablePeriods
      .map((periodo) => {
        const hora = resolvePeriodoDisponivelHora(periodo);

        if (!hora) {
          return null;
        }

        return {
          hora,
          bloqueado: false,
          ocupado: Boolean(periodo.isAgendado),
        };
      })
      .filter((slot): slot is ITimeSlotState => Boolean(slot));

    const uniqueSlots = new Map<string, ITimeSlotState>();

    slots.forEach((slot) => {
      uniqueSlots.set(slot.hora, slot);
    });

    return Array.from(uniqueSlots.values()).sort((left, right) =>
      left.hora.localeCompare(right.hora),
    );
  }, [availablePeriods]);
  const selectedDateHasAgendamento = selectedDate
    ? (hasLoadedAvailablePeriods
        ? availableTimeSlotStates.some((slot) => slot.ocupado)
        : hasAgendamentoOnDate(selectedDate, agendamentos))
    : false;
  const mockTimeSlots = useMemo(() => buildMockHourlySlots(), []);
  const resolvedTimeSlots = useMemo(() => {
    if (!selectedService) {
      return [];
    }

    if (selectedDate) {
      if (!isSelectedDateEnabled) {
        return [];
      }

      if (hasLoadedAvailablePeriods) {
        return availableTimeSlotStates;
      }

      return timeSlotStates;
    }

    return mockTimeSlots;
  }, [
    availableTimeSlotStates,
    hasLoadedAvailablePeriods,
    isSelectedDateEnabled,
    mockTimeSlots,
    selectedDate,
    selectedService,
    timeSlotStates,
  ]);
  const canShowTimeSlots = Boolean(selectedService && isSelectedDateEnabled);
  const maxTimeSlotsOffset = Math.max(resolvedTimeSlots.length - TIME_SLOTS_PAGE_SIZE, 0);
  const defaultTimeSlotsOffset = useMemo(() => {
    const defaultIndex = resolvedTimeSlots.findIndex(
      (slot) => slot.hora >= DEFAULT_VISIBLE_HOUR,
    );

    if (defaultIndex < 0) {
      return 0;
    }

    return Math.min(defaultIndex, maxTimeSlotsOffset);
  }, [maxTimeSlotsOffset, resolvedTimeSlots]);
  const visibleTimeSlots = useMemo(
    () =>
      resolvedTimeSlots.slice(
        timeSlotsOffset,
        timeSlotsOffset + TIME_SLOTS_PAGE_SIZE,
      ),
    [resolvedTimeSlots, timeSlotsOffset],
  );

  useEffect(() => {
    setTimeSlotsOffset(defaultTimeSlotsOffset);
  }, [defaultTimeSlotsOffset]);

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    const stillExists = resolvedTimeSlots.some((slot) => slot.hora === selectedTime);

    if (!stillExists) {
      setSelectedTime(null);
    }
  }, [resolvedTimeSlots, selectedTime]);

  const handleSubmit = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !selectedServiceId ||
      Number.isNaN(numericColaboradorId)
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await colaboradorAgendamentoService.persistirAgendamento({
        idServico: Number(selectedServiceId),
        idColaborador: numericColaboradorId,
        dataInicioAgendamento: formatRequestDateTime(selectedDate, selectedTime),
      });
      navigate("/meus-agendamentos", {
        state: {
          successMessage: "Agendamento realizado com sucesso.",
        },
      });
      return;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel concluir o agendamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <Banner />

      <section className={styles.section}>
        {!isAuthenticated ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Login necessario para agendar.</p>
            <a className={styles.backLink} href={LOGIN_URL}>
              Ir para login
            </a>
          </div>
        ) : null}

        {isLoading ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando agenda...</p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar agenda.</p>
            <p className={styles.feedbackText}>{error}</p>
          </div>
        ) : null}

        {!isLoading && !error && !colaborador ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Colaborador nao encontrado.</p>
            <Link className={styles.backLink} to={`/vitrineLoja/${lojaId}`}>
              Voltar para a loja
            </Link>
          </div>
        ) : null}

        {isAuthenticated && !isLoading && !error && colaborador ? (
          <>
            <section className={styles.heroCard}>
              <div className={styles.imagePanel}>
                {principalImagem ? (
                  <img
                    alt={principalTitulo}
                    className={styles.image}
                    src={principalImagem}
                  />
                ) : (
                  <div className={styles.imageFallback} aria-hidden="true" />
                )}
              </div>

              <div className={styles.heroContent}>
                <span className={styles.eyebrow}>Agendamento</span>
                <h1 className={styles.title}>{colaborador.nome ?? "Profissional"}</h1>
                <p className={styles.description}>
                  Escolha uma data para continuar o fluxo de agendamento. Esta tela
                  esta mockada por enquanto, mas ja segue o layout da vitrine.
                </p>
                <div className={styles.actions}>
                  <Link
                    className={styles.secondaryButton}
                    to={buildAgendaLink(colaborador.lojaId, colaborador.colaboradorId)}
                  >
                    Voltar ao colaborador
                  </Link>
                </div>
              </div>
            </section>

            <section className={styles.calendarSection}>
              <div className={styles.calendarCard}>
                <div className={styles.calendarHeader}>
                  <div>
                    <span className={styles.cardLabel}>Calendario</span>
                    <h2 className={styles.calendarTitle}>
                      {MONTH_FORMATTER.format(calendarDate)}
                    </h2>
                  </div>

                  <div className={styles.calendarControls}>
                    <button
                      className={styles.controlButton}
                      type="button"
                      onClick={() =>
                        setCalendarDate(
                          (current) =>
                            new Date(current.getFullYear(), current.getMonth() - 1, 1),
                        )
                      }
                    >
                      {"<"}
                    </button>
                    <button
                      className={styles.controlButton}
                      type="button"
                      onClick={() =>
                        setCalendarDate(
                          (current) =>
                            new Date(current.getFullYear(), current.getMonth() + 1, 1),
                        )
                      }
                    >
                      {">"}
                    </button>
                  </div>
                </div>

                <div className={styles.weekdays}>
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label} className={styles.weekday}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className={styles.calendarGrid}>
                  {monthDays.map((day, index) =>
                    day ? (() => {
                      const isAvailable = isDateAvailable(day, agendas);
                      const isOutsideAgendaWeek = isDateOutsideAgendaWeek(day, agendas);
                      const isBlocked = isDateBlocked(day, agendas);
                      const hasAgendamento = isOutsideAgendaWeek;
                      const isReadOnly = !isAvailable || isBlocked || isOutsideAgendaWeek;

                      return (
                        <button
                          key={day.toISOString()}
                          className={styles.dayButton}
                          data-selected={
                            selectedDate?.toDateString() === day.toDateString()
                          }
                          data-today={isSameDay(day, new Date())}
                          data-booked={hasAgendamento}
                          data-readonly={isReadOnly}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedTime(null);
                            setTimeSlotsOffset(defaultTimeSlotsOffset);
                          }}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })() : (
                      <div
                        key={`empty-${index}`}
                        className={styles.emptyDay}
                        aria-hidden="true"
                      />
                    ),
                  )}
                </div>

                <div className={styles.selectionBox}>
                  <span className={styles.cardLabel}>Servico</span>
                  <label className={styles.fieldLabel} htmlFor="agendamento-servico">
                    Escolha o servico para continuar o agendamento.
                  </label>
                  <select
                    id="agendamento-servico"
                    className={styles.selectField}
                    value={selectedServiceId}
                    onChange={(event) => {
                      setSelectedServiceId(event.target.value);
                      setSelectedTime(null);
                      setTimeSlotsOffset(defaultTimeSlotsOffset);
                    }}
                  >
                    <option value="">Selecione um servico</option>
                    {servicos.map((servico) => (
                      <option key={servico.id} value={String(servico.id)}>
                        {servico.descricao ?? "Servico"} - R${" "}
                        {servico.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div ref={timeSectionRef} className={styles.timeSection}>
                    <div className={styles.timeHeader}>
                      <div>
                        <span className={styles.cardLabel}>Horarios</span>
                        <p className={styles.selectionText}>
                          {selectedDate && selectedService
                            ? "Escolha um horario disponivel para continuar o agendamento."
                            : selectedService
                              ? "Selecione uma data habilitada para exibir os horarios disponiveis."
                              : "Selecione o servico para exibir os horarios disponiveis."}
                        </p>
                      </div>

                      <div className={styles.calendarControls}>
                        <button
                          className={styles.controlButton}
                          disabled={!canShowTimeSlots || timeSlotsOffset === 0}
                          type="button"
                          onClick={() =>
                            setTimeSlotsOffset((current) =>
                              Math.max(current - TIME_SLOTS_PAGE_SIZE, 0),
                            )
                          }
                        >
                          {"<"}
                        </button>
                        <button
                          className={styles.controlButton}
                          disabled={!canShowTimeSlots || timeSlotsOffset >= maxTimeSlotsOffset}
                          type="button"
                          onClick={() =>
                            setTimeSlotsOffset((current) =>
                              Math.min(
                                current + TIME_SLOTS_PAGE_SIZE,
                                maxTimeSlotsOffset,
                              ),
                            )
                          }
                        >
                          {">"}
                        </button>
                      </div>
                    </div>

                    <div className={styles.timeGrid}>
                      {canShowTimeSlots ? visibleTimeSlots.map((slot) => {
                        const isDisabled =
                          !selectedDate || slot.bloqueado || slot.ocupado;
                        return (
                          <button
                            key={slot.hora}
                            className={styles.timeButton}
                            data-booked={slot.bloqueado ? false : slot.ocupado}
                            data-selected={selectedTime === slot.hora}
                            disabled={isDisabled}
                            type="button"
                            onClick={() => setSelectedTime(slot.hora)}
                          >
                            {slot.hora}
                          </button>
                        );
                      }) : null}
                    </div>

                    {canShowTimeSlots && visibleTimeSlots.length === 0 ? (
                      <div className={styles.selectionBox}>
                        <span className={styles.cardLabel}>Horarios</span>
                        <p className={styles.selectionText}>
                          Nenhum horario foi gerado para o servico e data selecionados.
                        </p>
                      </div>
                    ) : null}

                    {availablePeriodsError ? (
                      <div className={styles.selectionBox}>
                        <span className={styles.cardLabel}>Horarios</span>
                        <p className={styles.selectionText}>{availablePeriodsError}</p>
                      </div>
                    ) : null}

                    {submitError ? (
                      <div className={styles.selectionBox}>
                        <span className={styles.cardLabel}>Agendamento</span>
                        <p className={styles.selectionText}>{submitError}</p>
                      </div>
                    ) : null}

                    <div className={styles.selectionBox}>
                      <span className={styles.cardLabel}>Horario selecionado</span>
                      <p className={styles.selectionText}>
                        {selectedTime && selectedDate
                          ? `${selectedDate.toLocaleDateString("pt-BR")} as ${selectedTime}`
                          : selectedService
                            ? "Selecione uma data habilitada e clique em um horario para continuar."
                            : "Preencha servico e data para escolher um horario."}
                      </p>
                      {selectedDateHasAgendamento ? (
                        <p className={styles.selectionStatus}>
                          Existem agendamentos nesse dia. Slots em rosa indicam horario
                          ja ocupado.
                        </p>
                      ) : null}
                    </div>

                    <button
                      className={styles.submitButton}
                      disabled={
                        !selectedDate || !selectedTime || !selectedServiceId || isSubmitting
                      }
                      type="button"
                      onClick={() => {
                        void handleSubmit();
                      }}
                    >
                      {isSubmitting ? "Agendando..." : "Agendar"}
                     </button>
                  </div>
              </div>
            </section>
          </>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
