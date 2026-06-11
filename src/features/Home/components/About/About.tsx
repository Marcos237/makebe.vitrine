import styles from "./About.module.css";

const aboutItems = [
  "Consulta personalizada antes de cada atendimento.",
  "Ambiente de studio com atmosfera intimista e acabamento premium.",
  "Produtos selecionados para performance, brilho e protecao.",
];

export function About() {
  return (
    <section className={styles.section} id="sobre">
      <div className={styles.panel}>
        <div>
          <span className={styles.eyebrow}>Sobre</span>
          <h2 className={styles.title}>Minimalismo, tecnica e presenca visual</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.text}>
            A Home segue uma linguagem escura, elegante e altamente visual para
            posicionar a Makebe como uma experiencia premium desde o primeiro scroll.
          </p>

          <ul className={styles.list}>
            {aboutItems.map((item) => (
              <li key={item} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
