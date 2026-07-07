import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import { useParams } from "react-router-dom";
import { Colaboradores } from "../components/Colaboradores/Colaboradores";
import { SobreLoja } from "../components/SobreLoja/SobreLoja";
import { TopCarousel } from "../components/TopCarousel/TopCarousel";
import { useVitrineLoja } from "../hooks/useVitrineLoja";
import styles from "../styles/VitrineLojaPage.module.css";

export function VitrineLojaPage() {
  const { vitrine = "" } = useParams();
  const { lojas, isLoading, error } = useVitrineLoja();
  const numericVitrineId = Number(vitrine);
  const isNumericVitrineId = !Number.isNaN(numericVitrineId);
  const selectedLoja = lojas.find((loja) => {
    if (isNumericVitrineId && loja.id === numericVitrineId) {
      return true;
    }

    const razaoSocialSlug = (loja.razaoSocial ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return razaoSocialSlug === vitrine.toLowerCase();
  });
  const resolvedLojaId = isNumericVitrineId ? numericVitrineId : selectedLoja?.id;

  return (
    <main className={styles.page}>
      <Banner />

      {isLoading ? (
        <section className={styles.feedbackSection}>
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando vitrine da loja...</p>
          </div>
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className={styles.feedbackSection}>
          <div className={styles.errorBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar a vitrine.</p>
            <p className={styles.feedbackText}>{error}</p>
          </div>
        </section>
      ) : null}

      {!isLoading && !error ? (
        <>
          <TopCarousel items={lojas} showCaption={false} />
          <Colaboradores lojaId={resolvedLojaId} />
          <SobreLoja vitrine={vitrine} lojaId={resolvedLojaId} />
        </>
      ) : null}

      <Footer />
    </main>
  );
}
