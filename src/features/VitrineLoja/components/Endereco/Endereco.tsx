import styles from "./Endereco.module.css";

interface EnderecoProps {
  endereco: string;
  cep: string;
  numero: string;
  telefone: string;
  email: string;
  mapaUrl: string;
}

export function Endereco({
  endereco,
  cep,
  numero,
  telefone,
  email,
  mapaUrl,
}: EnderecoProps) {
  return (
    <div className={styles.card}>
      <div className={styles.item}>
        <span className={styles.label}>Endereco</span>
        <p className={styles.value}>{endereco}</p>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>CEP</span>
        <p className={styles.value}>{cep}</p>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Numero</span>
        <p className={styles.value}>{numero}</p>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Telefone</span>
        <p className={styles.value}>{telefone}</p>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Email</span>
        <p className={styles.value}>{email}</p>
      </div>
      <iframe
        className={styles.map}
        title="Mapa da loja"
        src={mapaUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
