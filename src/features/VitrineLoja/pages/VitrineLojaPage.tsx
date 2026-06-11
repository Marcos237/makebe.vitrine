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
  const selectedLoja = lojas.find((loja) => {
    if (!Number.isNaN(numericVitrineId) && loja.id === numericVitrineId) {
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
          <Colaboradores lojaId={selectedLoja?.id} />
          <SobreLoja vitrine={vitrine} lojaId={selectedLoja?.id} />
        </>
      ) : null}

      <Footer />
    </main>
  );
}
