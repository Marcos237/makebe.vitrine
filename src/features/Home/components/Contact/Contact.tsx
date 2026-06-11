import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section className={styles.section} id="contato">
      <div className={styles.info}>
        <span className={styles.eyebrow}>Contato</span>
        <h2 className={styles.title}>Agende sua proxima transformacao</h2>
        <p className={styles.text}>
          Atendimento com horario reservado, curadoria visual e foco em resultado.
        </p>
      </div>

      <div className={styles.card}>
        <a className={styles.line} href="tel:+5500000000000">
          +55 (00) 0000-0000
        </a>
        <a className={styles.line} href="mailto:contato@makebe.com.br">
          contato@makebe.com.br
        </a>
        <p className={styles.address}>Av. Studio Premium, 100. Sao Paulo, SP.</p>
      </div>
    </section>
  );
}
