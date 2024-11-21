export interface FeaturedPlaylistsRepsonse {
  message: string;
  playlists: FeaturedPlaylists;
}

export interface FeaturedPlaylists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: FeaturedPlaylistItem[];
}

export interface FeaturedPlaylistItem {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Owner {
  external_urls: ExternalUrls;
  followers: Tracks;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface Tracks {
  href: string;
  total: number;
}
