import { useEffect, useState } from "react";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import { Link, useParams } from "react-router-dom";
import { LOGIN_URL } from "../../../config/apiConfig";
import { useUsuarioSessao } from "../../../hooks/useUsuarioSessao";
import { TopCarousel } from "../components/TopCarousel/TopCarousel";
import { useColaboradoresProfissionais } from "../hooks/useColaboradoresProfissionais";
import type { IColaboradorPortifolioImagem } from "../interfaces/IColaboradorPortifolioImagem";
import { colaboradorPortifolioImagemService } from "../services/colaboradorPortifolioImagemService";
import styles from "../styles/ColaboradorVitrinePage.module.css";

const EMPTY_PARAGRAPH_HTML = "<p><br></p>";

function buildAgendaLink(
  isAuthenticated: boolean,
  lojaId?: number,
  colaboradorId?: number,
) {
  if (!isAuthenticated) {
    return LOGIN_URL;
  }

  if (!colaboradorId || !lojaId) {
    return "/#contato";
  }

  return `/agendamento/${lojaId}/${colaboradorId}`;
}

export function ColaboradorVitrinePage() {
  const { lojaId = "", colaboradorId = "" } = useParams();
  const numericLojaId = Number(lojaId);
  const numericColaboradorId = Number(colaboradorId);
  const [portifolioImagens, setPortifolioImagens] = useState<IColaboradorPortifolioImagem[]>([]);
  const [isLoadingPortifolio, setIsLoadingPortifolio] = useState(false);
  const { isAuthenticated } = useUsuarioSessao();
  const { colaboradores, isLoading, error } =
    useColaboradoresProfissionais(Number.isNaN(numericLojaId) ? undefined : numericLojaId);

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

      setIsLoadingPortifolio(true);

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
      } finally {
        if (isMounted) {
          setIsLoadingPortifolio(false);
        }
      }
    };

    void loadPortifolioImagens();

    return () => {
      isMounted = false;
    };
  }, [numericColaboradorId]);

  const carouselItems =
    portifolioImagens.length > 0
      ? portifolioImagens.map((imagem, index) => ({
          id: colaborador?.id ? Number(`${colaborador.id}${index + 1}`) : index + 1,
          razaoSocial: imagem.nomeColaborador ?? colaborador?.nome,
          tituloImagem: imagem.tituloImagem ?? imagem.nomeColaborador ?? colaborador?.nome,
          urlImagem: imagem.urlImagem ?? colaborador?.urlImagem,
        }))
      : !isLoadingPortifolio && colaborador
        ? [
            {
              id: colaborador.id,
              razaoSocial: colaborador.nome,
              tituloImagem: colaborador.nome,
              urlImagem: colaborador.urlImagem,
            },
          ]
        : [];
  const contatoColaborador = portifolioImagens[0];
  const textoProfissional = contatoColaborador?.texto?.trim() ?? "";
  const hasTextoProfissional =
    textoProfissional.length > 0 && textoProfissional !== EMPTY_PARAGRAPH_HTML;

  return (
    <main className={styles.page}>
      <Banner />

      <section className={styles.section}>
        {isLoading ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando colaborador...</p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar colaborador.</p>
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

        {!isLoading && !error && colaborador ? (
          <>
            {isLoadingPortifolio ? (
              <div className={styles.feedbackBox}>
                <p className={styles.feedbackTitle}>Carregando portifolio...</p>
              </div>
            ) : (
              <>
                <TopCarousel items={carouselItems} showCaption={false} />

                <section className={styles.topActionSection}>
                  <div className={styles.topActionCard}>
                    <span className={styles.cardLabel}>Agendamento</span>
                    <p className={styles.cardText}>
                      Continue para a etapa de agendamento e escolha o melhor horario para
                      atendimento.
                    </p>
                    <div className={styles.actions}>
                      <Link
                        className={styles.primaryButton}
                        aria-disabled={colaborador.isAgendaVisible === false}
                        to={buildAgendaLink(
                          isAuthenticated && colaborador.isAgendaVisible !== false,
                          colaborador.lojaId,
                          colaborador.colaboradorId,
                        )}
                      >
                        {colaborador.isAgendaVisible === false ? "Agenda indisponivel" : "Agendar"}
                      </Link>
                    </div>
                  </div>
                </section>
              </>
            )}

            <section className={styles.infoGrid}>
              <article className={styles.infoCard}>
                <span className={styles.eyebrow}>Colaborador</span>
                <h1 className={styles.title}>{colaborador.nome ?? "Profissional"}</h1>
                <span className={styles.cardLabel}>Especialidade</span>
                <p className={styles.cardText}>
                  {colaborador.descricaoServico ??
                    "Sem descricao detalhada cadastrada para este colaborador."}
                </p>
              </article>

              <article className={styles.infoCard}>
                <span className={styles.cardLabel}>Contato</span>
                <p className={styles.cardText}>
                  <strong>Email:</strong> {contatoColaborador?.email ?? "Email nao informado."}
                </p>
                <p className={styles.cardText}>
                  <strong>Telefone:</strong> {contatoColaborador?.telefone ?? "Telefone nao informado."}
                </p>
                <div className={styles.actions}>
                  <Link className={styles.secondaryButton} to={`/vitrineLoja/${colaborador.lojaId}`}>
                    Voltar para a loja
                  </Link>
                </div>
              </article>
            </section>

            {hasTextoProfissional ? (
              <section className={styles.aboutSection}>
                <article className={styles.aboutCard}>
                  <span className={styles.cardLabel}>Sobre o profissional</span>
                  <div
                    className={styles.richText}
                    dangerouslySetInnerHTML={{ __html: textoProfissional }}
                  />
                </article>
              </section>
            ) : null}
          </>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
