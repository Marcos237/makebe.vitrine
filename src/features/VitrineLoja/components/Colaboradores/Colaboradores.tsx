import { useColaboradoresProfissionais } from "../../hooks/useColaboradoresProfissionais";
import { Link } from "react-router-dom";
import styles from "./Colaboradores.module.css";

interface ColaboradoresProps {
  lojaId?: number;
}

export function Colaboradores({ lojaId }: ColaboradoresProps) {
  const { colaboradores, isLoading, error } =
    useColaboradoresProfissionais(lojaId);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Colaboradores</span>
      </div>

      {isLoading ? <p className={styles.feedback}>Carregando colaboradores...</p> : null}
      {!isLoading && error ? <p className={styles.feedback}>{error}</p> : null}
      {!isLoading && !error && colaboradores.length === 0 ? (
        <p className={styles.feedback}>Nenhum colaborador encontrado para esta loja.</p>
      ) : null}

      {!isLoading && !error && colaboradores.length > 0 ? (
        <div className={styles.grid}>
          {colaboradores.map((colaborador) => (
            <article key={colaborador.id} className={styles.card}>
              {colaborador.isAgendaVisible === false ? (
                <div className={styles.imageButtonDisabled} aria-disabled="true">
                  {colaborador.urlImagem ? (
                    <img
                      alt={colaborador.nome ?? "Colaborador da loja"}
                      className={styles.image}
                      src={colaborador.urlImagem}
                    />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true" />
                  )}
                </div>
              ) : (
                <Link
                  className={styles.imageButton}
                  to={`/colaboradorVitrine/${colaborador.lojaId}/${colaborador.colaboradorId}`}
                >
                  {colaborador.urlImagem ? (
                    <img
                      alt={colaborador.nome ?? "Colaborador da loja"}
                      className={styles.image}
                      src={colaborador.urlImagem}
                    />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true" />
                  )}
                </Link>
              )}
              <div className={styles.content}>
                <h3 className={styles.name}>{colaborador.nome ?? "Profissional"}</h3>
                <span className={styles.roleLabel}>Especialidade</span>
                <p className={styles.role}>
                  {colaborador.descricaoServico ?? "Especialidade nao informada."}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
