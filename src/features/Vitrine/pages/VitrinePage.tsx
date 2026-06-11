import { VitrineList } from "../components/VitrineList";
import { useVitrine } from "../hooks/useVitrine";
import styles from "../styles/VitrinePage.module.css";

export function VitrinePage() {
  const { itens, isLoading, error } = useVitrine();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Feature Vitrine</span>
          <h1 className={styles.title}>Projetos em destaque com arquitetura modular.</h1>
          <p className={styles.description}>
            Estrutura enterprise com React, TypeScript, CSS Modules, hooks e
            services separados por responsabilidade.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        {isLoading ? (
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando vitrine...</p>
            <p className={styles.feedbackText}>Aguarde enquanto os itens sao preparados.</p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className={styles.errorBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar.</p>
            <p className={styles.feedbackText}>{error}</p>
          </div>
        ) : null}

        {!isLoading && !error ? <VitrineList itens={itens} /> : null}
      </section>
    </main>
  );
}
