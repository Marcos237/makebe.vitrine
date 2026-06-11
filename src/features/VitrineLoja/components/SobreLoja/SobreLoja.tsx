import { useEffect, useState } from "react";
import type { ILojaEndereco } from "../../interfaces/ILojaEndereco";
import { lojaEnderecoService } from "../../services/lojaEnderecoService";
import { Endereco } from "../Endereco/Endereco";
import styles from "./SobreLoja.module.css";

interface SobreLojaProps {
  vitrine: string;
  lojaId?: number;
}

const EMPTY_PARAGRAPH_HTML = "<p><br></p>";

function buildEndereco(enderecoLoja: ILojaEndereco) {
  return [
    enderecoLoja.logradouro,
    enderecoLoja.numero,
    enderecoLoja.complemento,
    enderecoLoja.cidade,
    enderecoLoja.estado,
  ]
    .filter((value) => value !== null && value !== undefined && `${value}`.trim() !== "")
    .join(", ");
}

function buildMapaUrl(enderecoLoja: ILojaEndereco) {
  const query = encodeURIComponent(
    [
      enderecoLoja.logradouro,
      enderecoLoja.numero,
      enderecoLoja.cidade,
      enderecoLoja.estado,
      enderecoLoja.cep,
    ]
      .filter(Boolean)
      .join(", "),
  );

  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function SobreLoja({ vitrine, lojaId }: SobreLojaProps) {
  const [lojaEndereco, setLojaEndereco] = useState<ILojaEndereco | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLojaEndereco = async () => {
      if (!lojaId) {
        setLojaEndereco(null);
        return;
      }

      setIsLoading(true);

      try {
        const response = await lojaEnderecoService.getByLojaId(lojaId);

        if (!isMounted) {
          return;
        }

        setLojaEndereco(response);
      } catch {
        if (!isMounted) {
          return;
        }

        setLojaEndereco(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadLojaEndereco();

    return () => {
      isMounted = false;
    };
  }, [lojaId]);

  const titulo = lojaEndereco?.razaoSocial ?? "Sobre a loja";
  const texto = lojaEndereco?.texto?.trim() ?? "";
  const hasTexto = Boolean(texto) && texto !== EMPTY_PARAGRAPH_HTML;
  const enderecoCompleto = lojaEndereco ? buildEndereco(lojaEndereco) : "Endereco nao informado.";
  const mapaUrl = lojaEndereco ? buildMapaUrl(lojaEndereco) : "https://www.google.com/maps?output=embed";

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>Sobre a loja</span>
        <h2 className={styles.title}>{titulo}</h2>
        {hasTexto ? (
          <div
            className={styles.richText}
            dangerouslySetInnerHTML={{ __html: texto }}
          />
        ) : (
          <p className={styles.description}>
            Conteudo da loja indisponivel no momento para a vitrine <strong>{vitrine}</strong>.
          </p>
        )}
      </div>

      <Endereco
        endereco={enderecoCompleto}
        cep={lojaEndereco?.cep ?? "CEP nao informado."}
        numero={lojaEndereco?.numero?.toString() ?? "Numero nao informado."}
        telefone={lojaEndereco?.telefone ?? "Telefone nao informado."}
        email={lojaEndereco?.email ?? "Email nao informado."}
        mapaUrl={mapaUrl}
      />
    </section>
  );
}
