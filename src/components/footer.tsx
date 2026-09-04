import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Makebe App</p>

          <p className={styles.copy}>
            Experiências premium em corte, coloração e cuidado personalizado.
          </p>

          <p className={styles.copy}>
            Razão Social: 68.604.381 MARCOS DE LIMA
          </p>

          <p className={styles.copy}>
            CNPJ: 68.604.381/0001-51
          </p>

          <p className={styles.copy}>
            Telefone: (11) 9414-0788
          </p>
        </div>

        <p className={styles.rights}>
          © 2026 Makebe. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
