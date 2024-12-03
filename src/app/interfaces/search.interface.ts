export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface Artist {
  id: string;
  name: string;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
  images?: Image[];
  followers?: { total: number };
  genres?: string[];
  popularity?: number;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
  total_tracks: number;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
  artists: Artist[];
}

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  duration_ms: number;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
  preview_url?: string;
}

export interface SearchTracksResponse {
  tracks: Track;
}

export interface SearchArtistsResponse {
  artists: Artist;
}

export interface SearchAlbumsResponse {
  albums: Album;
}
