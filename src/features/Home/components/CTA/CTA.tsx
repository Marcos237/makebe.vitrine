import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div>
          <span className={styles.eyebrow}>Reserva imediata</span>
          <h2 className={styles.title}>Agendar agora</h2>
        </div>
        <p className={styles.text}>
          Defina seu horario e receba um atendimento desenhado para o seu visual.
        </p>
        <a className={styles.button} href="#contato">
          Falar com a equipe
        </a>
      </div>
    </section>
  );
}
