import { Link } from "react-router-dom";
import { VitrineCard } from "../../../Vitrine/components/VitrineCard";
import type { IVitrine } from "../../../Vitrine/interfaces/IVitrine";
import type { IContatoVitrine } from "../../interfaces/IContatoVitrine";
import type { IItemVitrine } from "../../interfaces/IItemVitrine";
import type { IServicoVitrine } from "../../interfaces/IServicoVitrine";
import styles from "./Services.module.css";

function mapServicoToCard(servico: IServicoVitrine): IVitrine {
  return {
    id: String(servico.id),
    titulo: servico.titulo?.trim() || "Servico sem titulo",
    descricao:
      servico.subtitulo?.trim() ||
      servico.texto?.trim() ||
      "Descricao do servico indisponivel.",
    categoria: servico.categoria?.trim() || "Servico",
    imagemUrl: servico.urlImagem?.trim() || "",
  };
}

function buildPesquisaCategoriaLink(servico: IServicoVitrine) {
  const termo = servico.categoria?.trim() || servico.titulo?.trim() || "";
  const query = new URLSearchParams({
    termo,
  });

  return `/vitrine/pesquisa?${query.toString()}`;
}

interface ServicesProps {
  item?: IItemVitrine | null;
  items: IServicoVitrine[];
  contatos: IContatoVitrine[];
}

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

function getContactIcon(title: string) {
  const normalizedTitle = normalizeTitle(title);

  if (normalizedTitle === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIcon}>
        <path
          fill="currentColor"
          d="M19.05 4.94A9.87 9.87 0 0 0 12 2a9.93 9.93 0 0 0-8.57 14.98L2 22l5.2-1.36A9.93 9.93 0 1 0 19.05 4.94Zm-7.05 15a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.09.81.82-3.01-.2-.31A8.23 8.23 0 1 1 12 19.94Zm4.52-6.18c-.24-.12-1.41-.7-1.63-.77-.22-.08-.38-.12-.54.12-.16.23-.62.77-.76.93-.14.15-.28.17-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.18-1.41-1.32-1.65-.14-.23-.01-.36.1-.48.1-.09.24-.24.35-.36.12-.12.16-.2.24-.35.08-.16.04-.29-.02-.4-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.4.06-.62.29-.22.23-.84.82-.84 1.99s.86 2.3.98 2.46c.12.15 1.68 2.57 4.08 3.6.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z"
        />
      </svg>
    );
  }

  if (normalizedTitle === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIcon}>
        <path
          fill="currentColor"
          d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z"
        />
      </svg>
    );
  }

  if (normalizedTitle === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIcon}>
        <path
          fill="currentColor"
          d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm1.8.31v.14l7.2 5.4 7.2-5.4v-.14a.95.95 0 0 0-.95-.96H5.75a.95.95 0 0 0-.95.96Zm14.4 2.39-6.66 4.99a1 1 0 0 1-1.08 0L4.8 8.45v9.8c0 .52.43.95.95.95h12.5c.52 0 .95-.43.95-.95v-9.8Z"
        />
      </svg>
    );
  }

  return null;
}

function buildContactHref(title: string, descricao: string): string | null {
  const normalizedTitle = normalizeTitle(title);
  const value = descricao.trim();

  if (!value) {
    return null;
  }

  if (normalizedTitle === "whatsapp") {
    const phone = value.replace(/\D/g, "");
    return phone ? `https://wa.me/${phone}` : null;
  }

  if (normalizedTitle === "email") {
    return `mailto:${value}`;
  }

  if (normalizedTitle === "instagram") {
    return value;
  }

  return null;
}

export function Services({ item, items, contatos }: ServicesProps) {
  const title =
    item?.titulo?.trim() ||
    "Atendimento autoral do diagnostico ao acabamento";
  return (
    <section className={styles.section} id="categoria">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Serviços</span>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.grid}>
        {items.map((servico) => {
          const serviceItem = mapServicoToCard(servico);

          return (
          <Link
            key={serviceItem.id}
            className={styles.cardLink}
            to={buildPesquisaCategoriaLink(servico)}
          >
            <VitrineCard item={serviceItem} />
          </Link>
          );
        })}
      </div>

      <div className={styles.infoGrid}>
        <article className={styles.infoCard} id="contato">
          <span className={styles.infoLabel}>Quem somos</span>
          <h3 className={styles.infoTitle}>Uma curadoria focada em cuidado, tecnica e experiencia.</h3>
          <p className={styles.infoText}>
            Trabalhamos para conectar cada cliente ao profissional e ao servico
            mais alinhados ao seu estilo, com uma apresentacao clara e uma
            experiencia premium desde a primeira visita.
          </p>
        </article>

        <article className={styles.infoCard}>
          <span className={styles.infoLabel}>Contato</span>
          <h3 className={styles.infoTitle}>Fale com a equipe</h3>
          <div className={styles.contactList}>
            {contatos.map((contato) => {
              const href = buildContactHref(contato.titulo, contato.descricao);
              const shouldOpenInNewTab =
                href !== null && !href.startsWith("mailto:");

              return (
                <p className={styles.contactRow} key={contato.id}>
                  <span className={styles.contactBadge}>
                    {getContactIcon(contato.titulo)}
                  </span>
                  {href ? (
                    <a
                      className={styles.contactLink}
                      href={href}
                      target={shouldOpenInNewTab ? "_blank" : undefined}
                      rel={shouldOpenInNewTab ? "noreferrer" : undefined}
                    >
                      <span className={styles.infoText}>
                        <strong>{contato.titulo}:</strong> {contato.descricao}
                      </span>
                    </a>
                  ) : (
                    <span className={styles.infoText}>
                      <strong>{contato.titulo}:</strong> {contato.descricao}
                    </span>
                  )}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
