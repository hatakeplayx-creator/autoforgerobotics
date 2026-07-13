import { useState, useEffect } from "react";
import {
  getProducts,
  getProductBySku,
  getCategories,
  getHeroBanners,
  getServices,
  getNavLinks,
} from "@/services/productService";
import type { Product, Category, HeroBanner, ServiceItem } from "@/types/store";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useProducts(filters?: {
  q?: string;
  category?: string;
  brand?: string;
  sortBy?: string;
}) {
  const [state, setState] = useState<QueryState<Product[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const filterString = JSON.stringify(filters);

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true }));

    getProducts(filters)
      .then((products) => {
        if (!active) return;
        setState({ data: products, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      active = false;
    };
  }, [filterString]);

  return state;
}

export function useProductDetails(sku: string) {
  const [state, setState] = useState<QueryState<Product | undefined>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true }));

    getProductBySku(sku)
      .then((product) => {
        if (!active) return;
        setState({ data: product, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      active = false;
    };
  }, [sku]);

  return state;
}

export function useCategories() {
  const [state, setState] = useState<QueryState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    getCategories()
      .then((cats) => {
        if (!active) return;
        setState({ data: cats, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function useHeroBanners() {
  const [state, setState] = useState<QueryState<HeroBanner[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    getHeroBanners()
      .then((banners) => {
        if (!active) return;
        setState({ data: banners, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

interface Metadata {
  services: ServiceItem[];
  navLinks: string[];
}

export function useStoreMetadata() {
  const [state, setState] = useState<QueryState<Metadata>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    Promise.all([getServices(), getNavLinks()])
      .then(([services, navLinks]) => {
        if (!active) return;
        setState({ data: { services, navLinks }, loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({ data: null, loading: false, error: err });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
