"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Provider = "yandex" | "gis";

type LatLng = [number, number];

interface YMapEvent {
  get: (key: string) => LatLng;
}

interface YGeoObject {
  properties: { get: (key: string) => string | null | undefined };
  getAddressLine?: () => string;
}

interface YGeocoderResult {
  geoObjects: { get: (index: number) => YGeoObject | undefined };
}

interface YPlacemark {
  geometry: {
    setCoordinates: (coords: LatLng) => void;
    getCoordinates: () => LatLng;
  };
  events: { add: (event: string, handler: () => void) => void };
}

interface YMap {
  geoObjects: { add: (marker: YPlacemark) => void };
  events: { add: (event: string, handler: (e: YMapEvent) => void) => void };
  destroy: () => void;
}

interface YMaps {
  Map: new (
    element: HTMLElement,
    options: { center: LatLng; zoom: number; controls: string[] },
  ) => YMap;
  Placemark: new (
    coords: LatLng,
    props: Record<string, never>,
    options?: { draggable?: boolean; preset?: string },
  ) => YPlacemark;
  geocode: (coords: LatLng, options?: { results: number }) => Promise<YGeocoderResult>;
  ready: (callback: () => void) => void;
}

interface GisEvent {
  lngLat?: LatLng;
  get?: (key: string) => LatLng;
}

interface GisPlace {
  address_name?: string;
  full_name?: string;
}

interface GisGeocoder {
  reverse: (options: { location: LatLng }) => Promise<GisPlace[]>;
}

interface GisMarker {
  setCoordinates: (coords: LatLng) => void;
}

interface GisMap {
  on: (event: "click", handler: (e: GisEvent) => void) => void;
  destroy: () => void;
}

interface MapGL {
  Map: new (
    element: HTMLElement,
    options: { center: LatLng; zoom: number; key: string },
  ) => GisMap;
  Marker: new (map: GisMap, options: { coordinates: LatLng }) => GisMarker;
  Geocoder: new (options: { key: string; version: string }) => GisGeocoder;
}

declare global {
  interface Window {
    ymaps?: YMaps;
    mapgl?: MapGL;
  }
}

const DEFAULT_CENTER: LatLng = [55.7558, 37.6173]; // Москва

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-map-src="${src}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("failed to load map script")));
      return;
    }
    const s = document.createElement("script");
    s.dataset.mapSrc = src;
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load map script"));
    document.head.appendChild(s);
  });
}

async function loadYandex(key: string): Promise<YMaps> {
  if (window.ymaps) return window.ymaps;
  await loadScript(
    `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(key)}&lang=ru_RU`,
  );
  return new Promise((resolve) => window.ymaps!.ready(() => resolve(window.ymaps!)));
}

async function loadGis(key: string): Promise<MapGL> {
  if (window.mapgl) return window.mapgl;
  await loadScript(`https://mapgl.2gis.com/api/js/v1?key=${encodeURIComponent(key)}`);
  return window.mapgl!;
}

export function MapAddressInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (address: string) => void;
}) {
  const yandexKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY?.trim();
  const gisKey = process.env.NEXT_PUBLIC_2GIS_KEY?.trim();

  const providers = useMemo<Partial<Record<Provider, string>>>(() => {
    const map: Partial<Record<Provider, string>> = {};
    if (yandexKey) map.yandex = yandexKey;
    if (gisKey) map.gis = gisKey;
    return map;
  }, [gisKey, yandexKey]);
  const available = Object.keys(providers) as Provider[];

  const [provider, setProvider] = useState<Provider | null>(
    available.length > 0 ? (available[0] as Provider) : null,
  );
  const [mapError, setMapError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YMap | GisMap | null>(null);
  const markerRef = useRef<YPlacemark | GisMarker | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const destroyMap = useCallback(() => {
    try {
      mapRef.current?.destroy?.();
    } catch {
      /* ignore */
    }
    mapRef.current = null;
    markerRef.current = null;
  }, []);

  async function initYandexMap(key: string, container: HTMLDivElement) {
    const ymaps = await loadYandex(key);
    const map = new ymaps.Map(container, {
      center: DEFAULT_CENTER,
      zoom: 10,
      controls: ["zoomControl", "fullscreenControl"],
    });
    mapRef.current = map;

    const marker = new ymaps.Placemark(
      DEFAULT_CENTER,
      {},
      { draggable: true, preset: "islands#violetDotIcon" },
    );
    markerRef.current = marker;
    map.geoObjects.add(marker);

    async function resolveAddress(coords: LatLng) {
      try {
        const result = await ymaps.geocode(coords, { results: 1 });
        const first = result?.geoObjects?.get?.(0);
        const address =
          first?.properties?.get?.("text") ?? first?.getAddressLine?.() ?? coords.join(", ");
        onChangeRef.current(String(address));
      } catch {
        onChangeRef.current(coords.join(", "));
      }
    }

    map.events.add("click", (event) => {
      const coords = event.get("coords");
      marker.geometry.setCoordinates(coords);
      resolveAddress(coords);
    });
    marker.events.add("dragend", () => {
      const coords = marker.geometry.getCoordinates();
      resolveAddress(coords);
    });
  }

  async function initGisMap(key: string, container: HTMLDivElement) {
    const mapgl = await loadGis(key);
    const map = new mapgl.Map(container, {
      center: [DEFAULT_CENTER[1], DEFAULT_CENTER[0]], // 2ГИС: [lng, lat]
      zoom: 10,
      key,
    });
    mapRef.current = map;

    async function resolveAddress(coords: LatLng) {
      try {
        const geocoder = new mapgl.Geocoder({ key, version: "2.0" });
        const result = await geocoder.reverse({ location: coords });
        const first = Array.isArray(result) ? result[0] : (result as GisPlace);
        const address =
          first?.address_name ??
          first?.full_name ??
          (typeof first === "string" ? first : coords.join(", "));
        onChangeRef.current(String(address));
      } catch {
        onChangeRef.current(coords.join(", "));
      }
    }

    map.on("click", (event) => {
      const coords: LatLng | undefined = event.lngLat ?? event.get?.("lngLat");
      if (!coords) return;
      try {
        const MarkerCtor = mapgl.Marker;
        if (markerRef.current) {
          (markerRef.current as GisMarker).setCoordinates(coords);
        } else {
          markerRef.current = new MarkerCtor(map, { coordinates: coords });
        }
      } catch {
        /* маркер опционален */
      }
      resolveAddress(coords);
    });
  }

  useEffect(() => {
    if (!provider || !providers[provider]) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    setMapError("");
    (async () => {
      try {
        const key = providers[provider]!;
        if (provider === "yandex") await initYandexMap(key, container);
        if (provider === "gis") await initGisMap(key, container);
        if (cancelled) destroyMap();
      } catch {
        if (!cancelled) {
          setMapError("Не удалось загрузить карту. Проверьте API-ключ.");
          console.error("Map init failed");
        }
      }
    })();

    return () => {
      cancelled = true;
      destroyMap();
    };
  }, [provider, providers, destroyMap]);

  useEffect(() => () => destroyMap(), [destroyMap]);

  const inputClass =
    "w-full border border-line bg-panel px-4 py-3 font-mono text-[13px] tracking-tight text-white placeholder:text-zinc-600 outline-none transition focus:border-accent";

  return (
    <div className="space-y-3">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Адрес доставки"
        className={inputClass}
        autoComplete="street-address"
      />

      {available.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption text-zinc-500">или выберите на карте:</span>
          <div className="flex border border-line p-0.5">
            {providers.yandex && (
              <button
                type="button"
                onClick={() => setProvider("yandex")}
                className={`px-3 py-1 font-mono text-[11px] uppercase tracking-tight transition ${
                  provider === "yandex" ? "bg-accent text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Яндекс
              </button>
            )}
            {providers.gis && (
              <button
                type="button"
                onClick={() => setProvider("gis")}
                className={`px-3 py-1 font-mono text-[11px] uppercase tracking-tight transition ${
                  provider === "gis" ? "bg-accent text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                2ГИС
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative h-60 w-full overflow-hidden border border-line bg-panel"
        aria-hidden={!provider}
      />

      {mapError && (
        <p className="font-mono text-[11px] uppercase tracking-tight text-red-300">{mapError}</p>
      )}
    </div>
  );
}