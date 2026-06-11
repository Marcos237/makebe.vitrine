import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Makebe Studio</p>
          <p className={styles.copy}>
            Experiencias premium em corte, coloracao e cuidado personalizado.
          </p>
        </div>
        <p className={styles.rights}>© 2026 Makebe. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
