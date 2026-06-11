import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import { URL_IMAGENS } from "../../../config/apiConfig";
import { colaboradorProfissionalService } from "../../VitrineLoja";
import { usePesquisaAgendamento } from "../hooks/usePesquisaAgendamento";
import type { IPesquisaAgendamentoItem } from "../interfaces/IPesquisaAgendamentoItem";
import styles from "../styles/PesquisaAgendamentoPage.module.css";

const DEFAULT_FALLBACK_IMAGE = `${URL_IMAGENS}/logo_5.png`;
const SKELETON_ITEMS = 6;

function buildLojaLink(lojaId: number) {
  return `/vitrineLoja/${lojaId}`;
}

interface IPesquisaResultadoCardProps {
  isSubmitting: boolean;
  item: IPesquisaAgendamentoItem;
  onSelect: (item: IPesquisaAgendamentoItem) => void;
}

function PesquisaResultadoCard({
  isSubmitting,
  item,
  onSelect,
}: IPesquisaResultadoCardProps) {
  return (
    <button
      className={styles.cardButton}
      type="button"
      disabled={isSubmitting}
      onClick={() => onSelect(item)}
    >
      <article className={styles.card}>
        <img
          className={styles.cardImage}
          src={item.urlImagem?.trim() || DEFAULT_FALLBACK_IMAGE}
          alt={item.razaoSocial ?? "Loja da vitrine"}
        />
        <div className={styles.cardContent}>
          <span className={styles.cardTag}>
            {item.descricaoCategoria ?? "Categoria nao informada"}
          </span>
          <h2 className={styles.cardTitle}>{item.razaoSocial ?? "Loja"}</h2>
          <p className={styles.cardDescription}>
            Clique para abrir a vitrine da loja e visualizar os profissionais.
          </p>
        </div>
      </article>
    </button>
  );
}

function PesquisaResultadoSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.skeletonImage} />
      <div className={styles.cardContent}>
        <div className={styles.skeletonTag} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
      </div>
    </article>
  );
}

export function PesquisaAgendamentoPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLojaId, setSelectedLojaId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resultados, isLoading, error, hasSearched, searchedTerm, pesquisar } =
    usePesquisaAgendamento();
  const initialTerm = searchParams.get("termo")?.trim() ?? "";
  const shouldShowResultsPanel =
    isLoading || Boolean(error) || hasSearched;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!initialTerm) {
      return;
    }

    setSearchValue(initialTerm);
    void pesquisar(initialTerm);
  }, [initialTerm, pesquisar]);

  useEffect(() => {
    if (!hasSearched || isLoading || !resultsRef.current) {
      return;
    }

    resultsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hasSearched, isLoading, resultados.length, error]);

  const handleSearch = () => {
    void pesquisar(searchValue);
  };

  const handleSelectLoja = async (item: IPesquisaAgendamentoItem) => {
    if (!item.idLoja || selectedLojaId) {
      return;
    }

    setSelectedLojaId(item.idLoja);

    try {
      await colaboradorProfissionalService.getColaboradores(item.idLoja);
      navigate(buildLojaLink(item.idLoja));
    } catch {
      navigate(buildLojaLink(item.idLoja));
    } finally {
      setSelectedLojaId(null);
    }
  };

  return (
    <main className={styles.page}>
      <Banner />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Link className={styles.backButton} to="/">
            Voltar para home
          </Link>
          <h1 className={styles.title}>Encontre o servico ideal</h1>
          <p className={styles.description}>
            Pesquise por profissionais, lojas, categorias ou servicos.
          </p>

          <div className={styles.searchPanel}>
            <label className={styles.searchLabel} htmlFor="pesquisa-agendamento">
              O que voce esta procurando?
            </label>

            <div className={styles.searchForm}>
              <input
                id="pesquisa-agendamento"
                ref={inputRef}
                className={styles.searchInput}
                type="search"
                placeholder="O que voce esta procurando?"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
              />

              <button
                className={styles.searchButton}
                type="button"
                disabled={!searchValue.trim() || isLoading}
                onClick={handleSearch}
              >
                {isLoading ? "Pesquisando..." : "Pesquisar"}
              </button>
            </div>

            <p className={styles.searchExamples}>
              Exemplos: Corte masculino, Barba, Maria, Studio Hair, Estetica facial
            </p>
          </div>
        </div>
      </section>

      <section ref={resultsRef} className={styles.content}>
        {shouldShowResultsPanel ? (
          <div className={styles.resultsPanel}>
            {hasSearched && !isLoading && !error ? (
              <p className={styles.resultsCount}>
                {resultados.length}{" "}
                {resultados.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                {searchedTerm ? ` para "${searchedTerm}"` : ""}
              </p>
            ) : null}

            {isLoading ? (
              <div className={styles.grid} aria-label="Carregando resultados da pesquisa">
                {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
                  <PesquisaResultadoSkeleton key={index} />
                ))}
              </div>
            ) : null}

            {!isLoading && error ? (
              <div className={styles.errorBox} role="alert">
                <p className={styles.feedbackTitle}>Nao foi possivel realizar a pesquisa.</p>
                <p className={styles.feedbackText}>Tente novamente.</p>
              </div>
            ) : null}

            {!isLoading && hasSearched && !error && resultados.length === 0 ? (
              <div className={styles.feedbackBox}>
                <p className={styles.feedbackTitle}>Nenhum resultado encontrado.</p>
                <p className={styles.feedbackText}>
                  Tente pesquisar utilizando outros termos.
                </p>
              </div>
            ) : null}

            {!isLoading && !error && resultados.length > 0 ? (
              <div className={styles.grid}>
                {resultados.map((item) => (
                  <PesquisaResultadoCard
                    key={`${item.idLoja}-${item.razaoSocial ?? "loja"}`}
                    isSubmitting={selectedLojaId === item.idLoja}
                    item={item}
                    onSelect={(selectedItem) => {
                      void handleSelectLoja(selectedItem);
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
