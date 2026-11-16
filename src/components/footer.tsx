import { Link } from "react-router-dom";
import styles from "./footer.module.css";

function PrivacyIcon() {
  return (
    <svg aria-hidden="true" className={styles.documentIcon} viewBox="0 0 24 24">
      <path d="M12 3 5 6v5c0 4.6 2.9 8.7 7 10 4.1-1.3 7-5.4 7-10V6l-7-3Z" />
      <path d="m9.2 12 1.8 1.8 3.8-4" />
    </svg>
  );
}

function TermsIcon() {
  return (
    <svg aria-hidden="true" className={styles.documentIcon} viewBox="0 0 24 24">
      <path d="M7 3h7l3 3v15H7z" />
      <path d="M14 3v4h4M10 12h4M10 16h4" />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Makebe App</p>

          <p className={styles.copy}>
            Razão Social: 68.604.381 MARCOS DE LIMA
          </p>

          <p className={styles.copy}>
            CNPJ: 68.604.381/0001-51
          </p>

          <p className={styles.copy}>
            Telefone: (11) 94140-7887
          </p>
        </div>

        <div className={styles.rightsArea}>
          <p className={styles.institutionalTitle}>Informações</p>

          <nav className={styles.institutionalLinks} aria-label="Links institucionais">
            <Link className={styles.documentLink} to="/politica-de-privacidade">
              <PrivacyIcon />
              <span>Política de Privacidade</span>
            </Link>
            <Link className={styles.documentLink} to="/termos-de-uso">
              <TermsIcon />
              <span>Termos de Uso</span>
            </Link>
          </nav>

          <p className={styles.rights}>
            © 2026 Makebe. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
