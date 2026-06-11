import { useState } from "react";
import styles from "./sessao.module.css";

interface SessaoItem {
  nome: string;
  conteudo: string;
}

interface SessaoProps {
  isOpen: number;
  sessaoProps: SessaoItem[];
}

const Sessao = ({ isOpen, sessaoProps }: SessaoProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    isOpen > 0 ? 0 : null,
  );

  const toggleItem = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <div className={styles.wrapper}>
      {sessaoProps.map((sessao, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <section key={sessao.nome} className={styles.item}>
            <button
              aria-expanded={isExpanded}
              className={styles.trigger}
              type="button"
              onClick={() => toggleItem(index)}
            >
              <span>{sessao.nome}</span>
              <span className={styles.icon}>{isExpanded ? "-" : "+"}</span>
            </button>

            {isExpanded ? <div className={styles.content}>{sessao.conteudo}</div> : null}
          </section>
        );
      })}
    </div>
  );
};

export default Sessao;
