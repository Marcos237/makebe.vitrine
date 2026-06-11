import type { IVitrine } from "../interfaces/IVitrine";
import styles from "./VitrineCard.module.css";

interface VitrineCardProps {
  item: IVitrine;
}

export function VitrineCard({ item }: VitrineCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.cardImage}
        src={item.imagemUrl}
        alt={item.titulo}
      />
      <div className={styles.cardContent}>
        <span className={styles.cardTag}>{item.categoria}</span>
        <h2 className={styles.cardTitle}>{item.titulo}</h2>
        <p className={styles.cardDescription}>{item.descricao}</p>
      </div>
    </article>
  );
}
