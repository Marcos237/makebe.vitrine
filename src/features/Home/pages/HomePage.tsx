import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import { Carousel } from "../components/Carousel/Carousel";
import { Hero } from "../components/Hero/Hero";
import { Services } from "../components/Services/Services";
import { useHome } from "../hooks/useHome";
import styles from "../styles/HomePage.module.css";

export function HomePage() {
  const location = useLocation();
  const {
    activeIndex,
    bannerError,
    carouselTitleItem,
    carouselItems,
    heroItem,
    isLoadingBanners,
    nextSlide,
    previousSlide,
    contatosVitrine,
    servicosVitrine,
    servicesItem,
    setActiveIndex,
  } = useHome();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const target = document.querySelector(location.hash);

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const header = document.querySelector("header");
      const headerOffset = header instanceof HTMLElement ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(targetTop - headerOffset - 12, 0),
        behavior: "smooth",
      });
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [location.hash]);

  return (
    <main className={styles.page}>
      <Banner />
      {isLoadingBanners ? (
        <section className={styles.feedbackSection}>
          <div className={styles.feedbackBox}>
            <p className={styles.feedbackTitle}>Carregando banners...</p>
          </div>
        </section>
      ) : null}
      {!isLoadingBanners && bannerError ? (
        <section className={styles.feedbackSection}>
          <div className={styles.errorBox}>
            <p className={styles.feedbackTitle}>Falha ao carregar banners.</p>
            <p className={styles.feedbackText}>{bannerError}</p>
          </div>
        </section>
      ) : null}
      {!isLoadingBanners && !bannerError ? (
        <Carousel
          activeIndex={activeIndex}
          items={carouselItems}
          title={carouselTitleItem?.titulo?.trim() || undefined}
          onNext={nextSlide}
          onPrevious={previousSlide}
          onSelect={setActiveIndex}
        />
      ) : null}

      {/* #agendamento */}
      <Hero item={heroItem} />

      {/* #categoria */}
      <Services
        item={servicesItem}
        items={servicosVitrine}
        // #contato
        contatos={contatosVitrine}
      />
      <Footer />
    </main>
  );
}
