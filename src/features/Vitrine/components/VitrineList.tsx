import type { IVitrine } from "../interfaces/IVitrine";
import { VitrineCard } from "./VitrineCard";
import styles from "../styles/VitrinePage.module.css";

interface VitrineListProps {
  itens: IVitrine[];
}

export function VitrineList({ itens }: VitrineListProps) {
  return (
    <div className={styles.grid}>
      {itens.map((item) => (
        <VitrineCard key={item.id} item={item} />
      ))}
    </div>
  );
}
