import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import type { IMeuAgendamento } from "../interfaces/IMeuAgendamento";
import {
  meusAgendamentosService,
  type IPaginacao,
} from "../services/meusAgendamentosService";
import styles from "../styles/MeusAgendamentosPage.module.css";

interface ILocationState {
  successMessage?: string;
}

const PAGE_SIZE = 10;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function canDeleteAgendamento(agendamento: IMeuAgendamento) {
  if (agendamento.ehDesativado) {
    return true;
  }

  return new Date(agendamento.dataInicioAgendamento) > new Date();
}

export function MeusAgendamentosPage() {
  const location = useLocation();
  const locationState = location.state as ILocationState | null;
  const [agendamentos, setAgendamentos] = useState<IMeuAgendamento[]>([]);
  const [paginacao, setPaginacao] = useState<IPaginacao<IMeuAgendamento>>({
    quantidadePagina: PAGE_SIZE,
    totalPaginas: 1,
    total: 0,
    paginaAtual: 1,
    registroInicial: 1,
    objetos: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    locationState?.successMessage ?? null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgendamento, setSelectedAgendamento] = useState<IMeuAgendamento | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadAgendamentos = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await meusAgendamentosService.listar({
        paginaAtual: currentPage,
        quantidadePagina: PAGE_SIZE,
      });

      setAgendamentos(response.objetos);
      setPaginacao(response);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Nao foi possivel carregar os agendamentos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      try {
        await loadAgendamentos();
      } finally {
        if (!isMounted) {
          return;
        }
      }
    };

    void executeLoad();

    return () => {
      isMounted = false;
    };
  }, [loadAgendamentos]);

  const handleOpenDeleteModal = (agendamento: IMeuAgendamento) => {
    setSelectedAgendamento(agendamento);
    setDeleteError(null);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setSelectedAgendamento(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAgendamento || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await meusAgendamentosService.desativar({
        id: selectedAgendamento.id,
      });
      setSelectedAgendamento(null);
      setSuccessMessage("Agendamento excluido com sucesso.");
      await loadAgendamentos();
    } catch (deleteError) {
      setDeleteError(
        deleteError instanceof Error
          ? deleteError.message
          : "Nao foi possivel excluir o agendamento.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const pageNumbers = Array.from(
    { length: Math.max(paginacao.totalPaginas, 1) },
    (_, index) => index + 1,
  );

  return (
    <main className={styles.page}>
      <Banner />

      <section className={styles.section}>
        <section className={styles.heroCard}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Minha agenda</span>
            <h1 className={styles.title}>Meus agendamentos</h1>
            <p className={styles.description}>
              Consulte os agendamentos realizados e acompanhe os proximos horarios.
            </p>
            <div className={styles.actions}>
              <Link className={styles.secondaryButton} to="/">
                Voltar para home
              </Link>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando agendamentos...</p>
          </div>
        ) : null}

        {!isLoading && successMessage ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Operacao realizada com sucesso.</p>
            <p className={styles.feedbackText}>{successMessage}</p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar agendamentos.</p>
            <p className={styles.feedbackText}>{error}</p>
          </div>
        ) : null}

        {!isLoading && !error && agendamentos.length === 0 ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Nenhum agendamento encontrado.</p>
            <p className={styles.feedbackText}>
              Conclua um agendamento para visualizar os dados nesta tela.
            </p>
          </div>
        ) : null}

        {!isLoading && !error && agendamentos.length > 0 ? (
          <>
            <section className={styles.listSection}>
              {agendamentos.map((agendamento) => {
                const canDelete = canDeleteAgendamento(agendamento);

                return (
                  <article key={agendamento.id} className={styles.card}>
                    <span className={styles.cardLabel}>
                      {formatDate(agendamento.dataInicioAgendamento)}
                    </span>
                    <p className={styles.time}>
                      {formatTime(agendamento.dataInicioAgendamento)}
                    </p>
                    <p className={styles.info}>
                      <strong>Profissional:</strong> {agendamento.nomeColaborador ?? "-"}
                    </p>
                    <p className={styles.info}>
                      <strong>Servico:</strong> {agendamento.descricaoServico ?? "-"}
                    </p>

                    {canDelete ? (
                      <button
                        className={styles.deleteButton}
                        type="button"
                        onClick={() => {
                          handleOpenDeleteModal(agendamento);
                        }}
                      >
                        Excluir
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </section>

            <section className={styles.paginationSection}>
              <p className={styles.paginationText}>
                Pagina {paginacao.paginaAtual} de {paginacao.totalPaginas} • Total{" "}
                {paginacao.total}
              </p>

              <div className={styles.paginationActions}>
                <button
                  className={styles.paginationButton}
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  Anterior
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={styles.paginationNumber}
                    data-active={pageNumber === currentPage}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  className={styles.paginationButton}
                  type="button"
                  disabled={currentPage >= paginacao.totalPaginas}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, paginacao.totalPaginas),
                    )
                  }
                >
                  Proxima
                </button>
              </div>
            </section>
          </>
        ) : null}
      </section>

      {selectedAgendamento ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={handleCloseDeleteModal}
        >
          <div
            aria-labelledby="confirmar-exclusao-titulo"
            aria-modal="true"
            className={styles.modalCard}
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <span className={styles.cardLabel}>Confirmacao</span>
            <h2 id="confirmar-exclusao-titulo" className={styles.modalTitle}>
              Deseja excluir esse agendamento?
            </h2>
            {deleteError ? <p className={styles.modalText}>{deleteError}</p> : null}
            <div className={styles.modalActions}>
              <button
                className={styles.modalSecondaryButton}
                disabled={isDeleting}
                type="button"
                onClick={handleCloseDeleteModal}
              >
                Nao
              </button>
              <button
                className={styles.modalPrimaryButton}
                disabled={isDeleting}
                type="button"
                onClick={() => {
                  void handleConfirmDelete();
                }}
              >
                {isDeleting ? "Excluindo..." : "Sim"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </main>
  );
}
