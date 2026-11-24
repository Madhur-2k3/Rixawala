// Types mirror the server's Mongoose models (after .populate()).
// Later we can move these into a shared package so they never drift.
export type Stop = {
  _id: string;
  name: string;
  isStand: boolean;
  location: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

export type Route = {
  _id: string;
  code: string;
  name: string;
  isActive: boolean;
  stops: { stop: Stop; order: number; fareFromStart: number }[];
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getRoutes: () => get<Route[]>("/api/routes"),
  getRoute: (code: string) => get<Route>(`/api/routes/${code}`),
};
