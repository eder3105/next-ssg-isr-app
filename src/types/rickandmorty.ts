export interface RMRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: RMRef;
  location: RMRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterResponse {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: Character[];
}