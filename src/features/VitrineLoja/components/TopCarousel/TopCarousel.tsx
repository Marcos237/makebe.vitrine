import { useEffect, useState } from "react";
import type { ILojaVitrine } from "../../interfaces/ILojaVitrine";
import styles from "./TopCarousel.module.css";

interface TopCarouselProps {
  items: ILojaVitrine[];
  showCaption?: boolean;
}

export function TopCarousel({ items, showCaption = true }: TopCarouselProps) {
  const visibleItems = items.filter((item) => Boolean(item.urlImagem));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  useEffect(() => {
    if (visibleItems.length <= 1 || isAutoPlayPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % visibleItems.length);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoPlayPaused, visibleItems.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleItems.length]);

  if (visibleItems.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % visibleItems.length);
  };

  return (
    <section
      className={styles.section}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsAutoPlayPaused(true)}
      onMouseLeave={() => setIsAutoPlayPaused(false)}
    >
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Destaques</span>
        </div>

        <div className={styles.controls}>
          <button
            aria-label="Slide anterior"
            className={styles.controlButton}
            type="button"
            onClick={goToPrevious}
            onFocus={() => setIsAutoPlayPaused(true)}
            onBlur={() => setIsAutoPlayPaused(false)}
          >
            <span aria-hidden="true">{"<"}</span>
          </button>
          <button
            aria-label="Proximo slide"
            className={styles.controlButton}
            type="button"
            onClick={goToNext}
            onFocus={() => setIsAutoPlayPaused(true)}
            onBlur={() => setIsAutoPlayPaused(false)}
          >
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>

      <div className={styles.carousel}>
        {visibleItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={item.id}
              className={styles.slide}
              data-active={isActive}
              aria-hidden={!isActive}
              aria-label={`${index + 1} de ${visibleItems.length}`}
            >
              <img
                alt={item.tituloImagem ?? item.razaoSocial ?? "Loja em destaque"}
                className={styles.image}
                src={item.urlImagem}
              />
              <div className={styles.overlay}>
                {showCaption ? (
                  <div className={styles.copy}>
                    <span className={styles.badge}>
                      {item.tituloImagem ?? item.razaoSocial ?? "Selecao Makebe"}
                    </span>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Selecao de banners da loja">
        {visibleItems.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Ir para banner ${index + 1}`}
            aria-selected={index === activeIndex}
            className={styles.dot}
            data-active={index === activeIndex}
            role="tab"
            type="button"
            onClick={() => setActiveIndex(index)}
            onFocus={() => setIsAutoPlayPaused(true)}
            onBlur={() => setIsAutoPlayPaused(false)}
          />
        ))}
      </div>
    </section>
  );
}
