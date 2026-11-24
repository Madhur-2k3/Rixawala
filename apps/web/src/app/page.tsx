import { api, type Route } from "@/lib/api";

// Server Component: this fetch runs on the Next.js server, not in the browser.
export default async function Home() {
  let routes: Route[] = [];
  let error: string | null = null;

  try {
    routes = await api.getRoutes();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not reach the API";
  }

  return (
    <main className="mx-auto max-w-md p-4 font-sans">
      <h1 className="text-2xl font-bold">Rixawala</h1>
      <p className="mb-6 text-sm text-gray-500">Shared autos, live.</p>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}. Is the server running? (npm run dev:server)
        </p>
      )}

      {!error && routes.length === 0 && (
        <p className="text-sm text-gray-500">No routes yet. Run npm run seed.</p>
      )}

      <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route._id} className="rounded-xl border p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{route.name}</h2>
              <span className="text-xs text-gray-500">{route.code}</span>
            </div>
            <ol className="mt-3 space-y-1">
              {route.stops.map(({ stop, fareFromStart }) => (
                <li key={stop._id} className="flex justify-between text-sm">
                  <span>
                    {stop.name}
                    {stop.isStand && (
                      <span className="ml-2 rounded bg-yellow-100 px-1.5 text-xs text-yellow-800">
                        stand
                      </span>
                    )}
                  </span>
                  <span className="text-gray-600">₹{fareFromStart}</span>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </main>
  );
}
