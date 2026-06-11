import styles from "./Carousel.module.css";
import type { ICarouselItem } from "../../interfaces/IHomeBanner";
import { useNavigate } from "react-router-dom";

interface CarouselProps {
  activeIndex: number;
  items: ICarouselItem[];
  title?: string;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
}

export function Carousel({
  activeIndex,
  items,
  title,
  onNext,
  onPrevious,
  onSelect,
}: CarouselProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-roledescription="carousel">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Destaques</span>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
        </div>

        <div className={styles.controls}>
          <button
            aria-label="Slide anterior"
            className={styles.controlButton}
            type="button"
            onClick={onPrevious}
          >
            <span aria-hidden="true">{"<"}</span>
          </button>
          <button
            aria-label="Proximo slide"
            className={styles.controlButton}
            type="button"
            onClick={onNext}
          >
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>

      <div className={styles.carousel}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={item.id}
              className={styles.slide}
              data-active={isActive}
              aria-hidden={!isActive}
              aria-label={`${index + 1} de ${items.length}`}
              onClick={() => navigate(`/vitrineLoja/${item.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/vitrineLoja/${item.id}`);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img alt={item.title} className={styles.image} src={item.imageUrl} />
              <div className={styles.overlay}>
                <div className={styles.copy}>
                  <span className={styles.badge}>{item.subtitle}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Selecao de slides">
        {items.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Ir para slide ${index + 1}`}
            aria-selected={index === activeIndex}
            className={styles.dot}
            data-active={index === activeIndex}
            role="tab"
            type="button"
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </section>
  );
}
