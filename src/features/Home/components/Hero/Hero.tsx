import { Link } from "react-router-dom";
import { useUsuarioSessao } from "../../../../hooks/useUsuarioSessao";
import type { IItemVitrine } from "../../interfaces/IItemVitrine";
import styles from "./Hero.module.css";

interface HeroProps {
  item?: IItemVitrine | null;
}

export function Hero({ item }: HeroProps) {
  const title = item?.titulo?.trim() || "";
  const subtitle = item?.subtitulo?.trim() || "";
  const description = item?.texto?.trim() || "";
  const { isAuthenticated } = useUsuarioSessao();

  return (
    <section className={styles.hero} id="agendamento">
      <div className={styles.glowPrimary} />
      <div className={styles.glowSecondary} />
      <div className={styles.content}>
        <section className={styles.heroCard}>
          {subtitle ? <span className={styles.kicker}>{subtitle}</span> : null}

          <div className={styles.copyRow}>
            <div className={styles.copyMain}>
              {title ? <h1 className={styles.title}>{title}</h1> : null}
            </div>

            <div className={styles.sideContent}>
              {description ? <p className={styles.description}>{description}</p> : null}

              <div className={styles.ctaRow}>
                <Link className={styles.ctaButton} to="/vitrine/pesquisa">
                  Agendar agora
                </Link>
                {isAuthenticated ? (
                  <Link className={styles.secondaryButton} to="/meus-agendamentos">
                    Meus Agendamentos
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
