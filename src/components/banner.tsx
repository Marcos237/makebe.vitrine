import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_SESSAO_URL, URL_IMAGENS, resolveApiKey } from "../config/apiConfig";
import styles from "./banner.module.css";

const SESSION_USER_ENDPOINT = "UsuarioSessao";

interface SessionSubMenuItem {
  subMenuId?: number;
  subMenuDescricao?: string;
  subMenuUrl?: string;
  subMenuPaiId?: number | null;
}

interface SessionMenuItem {
  id: number;
  menuDescricao?: string;
  menuUrl?: string;
  subMenus?: SessionSubMenuItem[];
}

interface SessionUserData {
  id?: string;
  nome?: string;
  email?: string;
  urlImagem?: string;
  urlInicial?: string;
  menus?: SessionMenuItem[];
}

interface BannerProps {
  usuarioLogado?: {
    nome?: string;
    urlImagem?: string;
    menus?: SessionMenuItem[];
  };
}

const defaultNavigationItems: SessionMenuItem[] = [
  { id: 1, menuDescricao: "Home", menuUrl: "/" },
  { id: 2, menuDescricao: "Agendamento", menuUrl: "#agendamento" },
  { id: 3, menuDescricao: "Categoria", menuUrl: "#categoria" },
  { id: 4, menuDescricao: "Contato", menuUrl: "#contato" },
];

const defaultUserMenuItems: SessionMenuItem[] = [
  { id: 1, menuDescricao: "Login", menuUrl: "/login" },
  { id: 2, menuDescricao: "Cadastro", menuUrl: "/perfil" },
  { id: 3, menuDescricao: "Recuperar Senha", menuUrl: "/alteraSenha" },
];

const authenticatedUserMenuItems: SessionMenuItem[] = [
  { id: 1, menuDescricao: "Perfil", menuUrl: "/perfil" },
  { id: 2, menuDescricao: "Alterar Senha", menuUrl: "/alteraSenha" },
  { id: 3, menuDescricao: "Sair", menuUrl: "/Deslogar" },
];

function resolveMenuUrl(item?: { menuUrl?: string; subMenuUrl?: string }) {
  return item?.menuUrl || item?.subMenuUrl || "#";
}

function scrollToHashTarget(hash: string) {
  const target = document.querySelector(hash);

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const header = document.querySelector("header");
  const headerOffset = header instanceof HTMLElement ? header.offsetHeight : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(targetTop - headerOffset - 12, 0),
    behavior: "smooth",
  });
}

const Banner = ({ usuarioLogado: usuarioProp }: BannerProps) => {
  const [usuarioSessao, setUsuarioSessao] = useState<SessionUserData | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsuarioLogado = async () => {
      try {
        const response = await fetch(`${API_BASE_SESSAO_URL}${SESSION_USER_ENDPOINT}`, {
          credentials: "include",
          headers: {
            ApiKey: resolveApiKey(API_BASE_SESSAO_URL),
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SessionUserData | null;

        if (!isMounted) {
          return;
        }

        setUsuarioSessao(payload ?? null);
      } catch {
        if (isMounted) {
          setUsuarioSessao(null);
        }
      }
    };

    void loadUsuarioLogado();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }

      if (navRef.current && !navRef.current.contains(target)) {
        setActiveMenuId(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const usuarioLogado = usuarioProp ?? usuarioSessao;
  const firstName = usuarioLogado?.nome?.split(" ")[0];
  const avatarLabel = firstName?.charAt(0).toUpperCase() ?? "U";
  const navigationItems =
    usuarioLogado?.menus?.length ? usuarioLogado.menus : defaultNavigationItems;
  const profileItems = usuarioLogado
    ? authenticatedUserMenuItems
    : defaultUserMenuItems;

  const renderedNavigationItems = useMemo(
    () =>
      navigationItems.map((item) => {
        const rootSubMenus =
          item.subMenus?.filter((subItem) => subItem.subMenuPaiId == null) ?? [];

        return {
          ...item,
          rootSubMenus,
        };
      }),
    [navigationItems],
  );

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">
          <img
            src={`${URL_IMAGENS}/logo_5.png`}
            alt="Logo"
            className="imagem"
            style={{ width: "64px", height: "54px" }}
          />
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Abrir menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span className={styles.menuButtonLine} />
          <span className={styles.menuButtonLine} />
          <span className={styles.menuButtonLine} />
        </button>

        <nav
          id="main-navigation"
          ref={navRef}
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
          aria-label="Navegacao principal"
        >
          {renderedNavigationItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.navItem} ${
                item.rootSubMenus.length > 0 && activeMenuId === item.id
                  ? styles.navItemActive
                  : ""
              }`}
            >
              <a
                className={styles.navLink}
                href={resolveMenuUrl(item)}
                onClick={(event) => {
                  const url = resolveMenuUrl(item);
                  const isHomeHashLink = url.startsWith("/#");

                  if (item.rootSubMenus.length > 0) {
                    event.preventDefault();
                    setActiveMenuId((current) => (current === item.id ? null : item.id));
                  } else if (isHomeHashLink && window.location.pathname === "/") {
                    event.preventDefault();

                    const hash = url.slice(1);
                    scrollToHashTarget(hash);
                    setActiveMenuId(null);
                    setMobileMenuOpen(false);
                  } else {
                    setActiveMenuId(null);
                    setMobileMenuOpen(false);
                  }
                }}
              >
                {item.menuDescricao}
              </a>

              {item.rootSubMenus.length > 0 && activeMenuId === item.id ? (
                <div className={styles.dropdown}>
                  {item.rootSubMenus.map((subItem) => (
                    <a
                      key={subItem.subMenuId ?? subItem.subMenuDescricao}
                      className={styles.dropdownLink}
                      href={resolveMenuUrl(subItem)}
                      onClick={(event) => {
                        const url = resolveMenuUrl(subItem);
                        const isHomeHashLink = url.startsWith("/#");

                        if (isHomeHashLink && window.location.pathname === "/") {
                          event.preventDefault();

                          const hash = url.slice(1);
                          scrollToHashTarget(hash);
                        }

                        setActiveMenuId(null);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {subItem.subMenuDescricao}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div ref={profileRef} className={styles.profile}>
          <span className={styles.profileLabel}>
            {firstName ? `Ola, ${firstName}` : ""}
          </span>
          {usuarioLogado ? (
            <>
              <button
                aria-label={usuarioLogado.nome ?? "Usuario logado"}
                className={styles.avatarButton}
                title={usuarioLogado.nome ?? "Usuario logado"}
                type="button"
                onClick={() => setProfileMenuOpen((current) => !current)}
              >
                {usuarioLogado.urlImagem ? (
                  <img
                    alt={usuarioLogado.nome ?? "Usuario"}
                    className={styles.avatarImage}
                    src={usuarioLogado.urlImagem}
                  />
                ) : (
                  <span className={styles.avatar}>{avatarLabel}</span>
                )}
              </button>

              {profileMenuOpen ? (
                <div className={styles.profileDropdown}>
                  {profileItems.map((item) => (
                    <a
                      key={item.id}
                      className={styles.dropdownLink}
                      href={resolveMenuUrl(item)}
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      {item.menuDescricao}
                    </a>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <a className={styles.profileButton} href="/login">
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Banner;
