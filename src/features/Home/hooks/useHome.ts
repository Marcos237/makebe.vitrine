import { useEffect, useState } from "react";
import { homeService } from "../services/homeService";
import type { ICarouselItem } from "../interfaces/IHomeBanner";
import type { IContatoVitrine } from "../interfaces/IContatoVitrine";
import type { IItemVitrine } from "../interfaces/IItemVitrine";
import type { IServicoVitrine } from "../interfaces/IServicoVitrine";

const HERO_SESSION_ID = 1;
const CAROUSEL_SESSION_ID = 2;
const SERVICES_SESSION_ID = 3;

export function useHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState<ICarouselItem[]>([]);
  const [heroItem, setHeroItem] = useState<IItemVitrine | null>(null);
  const [carouselTitleItem, setCarouselTitleItem] = useState<IItemVitrine | null>(null);
  const [servicesItem, setServicesItem] = useState<IItemVitrine | null>(null);
  const [servicosVitrine, setServicosVitrine] = useState<IServicoVitrine[]>([]);
  const [contatosVitrine, setContatosVitrine] = useState<IContatoVitrine[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [bannerError, setBannerError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      setIsLoadingBanners(true);
      setBannerError(null);

      try {
        const [items, itemVitrine, servicos, contatos] = await Promise.all([
          homeService.getCarouselItems(),
          homeService.getItemVitrine(),
          homeService.getServicosVitrine(),
          homeService.getContatoVitrine(),
        ]);

        if (!isMounted) {
          return;
        }

        setCarouselItems(items);
        setHeroItem(
          itemVitrine.find((item) => item.idSessao === HERO_SESSION_ID) ?? null,
        );
        setCarouselTitleItem(
          itemVitrine.find((item) => item.idSessao === CAROUSEL_SESSION_ID) ?? null,
        );
        setServicesItem(
          itemVitrine.find((item) => item.idSessao === SERVICES_SESSION_ID) ?? null,
        );
        setServicosVitrine(servicos);
        setContatosVitrine(contatos);
        setActiveIndex(0);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os banners da vitrine.";

        setBannerError(message);
      } finally {
        if (isMounted) {
          setIsLoadingBanners(false);
        }
      }
    };

    void loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (carouselItems.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselItems.length);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [carouselItems.length]);

  const nextSlide = () => {
    if (carouselItems.length === 0) {
      return;
    }

    setActiveIndex((current) => (current + 1) % carouselItems.length);
  };

  const previousSlide = () => {
    if (carouselItems.length === 0) {
      return;
    }

    setActiveIndex((current) =>
      current === 0 ? carouselItems.length - 1 : current - 1,
    );
  };

  return {
    activeIndex,
    heroItem,
    carouselTitleItem,
    servicesItem,
    servicosVitrine,
    contatosVitrine,
    carouselItems,
    nextSlide,
    previousSlide,
    setActiveIndex,
    isLoadingBanners,
    bannerError,
  };
}
