# Next.js SSG + ISR: Pokédex y Rick and Morty

Laboratorio de **enrutamiento y páginas** con Next.js (App Router). Incluye dos aplicaciones en un mismo proyecto:

- **Pokédex** (`/pokemon`): rutas estáticas y dinámicas con la PokeAPI.
- **Rick and Morty** (`/rickandmorty`): lista, búsqueda en tiempo real y detalle de personajes con la Rick and Morty API.

**Demo:** LINK_VERCEL

## Tecnologías

- Next.js 16 (App Router, Turbopack)
- React 19 y TypeScript
- Tailwind CSS 4
- react-icons
- Desplegado en Vercel

## Estrategias de renderizado

| Parte | Estrategia | Por qué |
|---|---|---|
| Lista de Pokémon (`/pokemon`) | ISR (`revalidate: 86400`) | Los datos cambian poco; se regenera cada 24 horas |
| Detalle de Pokémon (`/pokemon/[name]`) | SSG + ISR | `generateStaticParams` genera los 151 Pokémon en el build |
| Lista de personajes (`/rickandmorty`) | SSR + `force-cache` (SSG) | El listado casi no cambia; se guarda en caché |
| Búsqueda de personajes | CSR (`useState` + `useEffect`) | Depende de lo que escribe el usuario |
| Detalle de personaje (`/rickandmorty/[id]`) | SSG + ISR (`revalidate: 864000`) | Se generan los 826 personajes en el build y se revalidan cada 10 días |

## Funcionalidades

**Pokédex**
- Lista de 151 Pokémon con imágenes (lazy loading).
- Página de detalle con tipos, estadísticas, altura, peso y habilidades.
- Manejo de errores (`error.tsx`) y páginas no encontradas (`not-found.tsx`).

**Rick and Morty**
- Lista de personajes con paginación.
- Búsqueda en tiempo real por nombre, status, type y gender (con debounce).
- Detalle con todos los campos del Response de la API y los episodios.
- Rutas estáticas para los 826 personajes.
- Respaldo local de datos (`src/data/characters.json`) para que el build no falle si la API responde 429.

## Estructura

```
src/
  app/
    page.tsx                  # Inicio
    pokemon/                  # Pokédex (lista, detalle, error, not-found)
    rickandmorty/             # Lista y detalle de personajes
  components/
    CharacterExplorer.tsx     # Búsqueda y filtros (cliente)
  lib/rickandmorty.ts         # Acceso a la API con reintentos y respaldo
  data/characters.json        # Copia local de los personajes
  types/                      # Tipos de TypeScript
scripts/
  snapshot.mjs                # Descarga la copia local de los datos
```

## Cómo ejecutarlo

Requisitos: Node.js 18.18 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Para producción:

```bash
npm run build
npm start
```

Para actualizar la copia local de los personajes:

```bash
node scripts/snapshot.mjs
```

## Autor

Ederd Carrasco Oscco, estudiante de Tecsup.
Curso: Desarrollo de Aplicaciones Web Avanzado.