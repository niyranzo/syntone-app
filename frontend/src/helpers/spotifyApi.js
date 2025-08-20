const clientId = 'd31ccd1c57c64cb19ccc5c6a618b939e';
const clientSecret = 'fc3b703fea77434f9cfe5bc235beb52f';

let accessToken = null;
let tokenExpiresAt = 0; // Timestamp en ms para controlar expiración

export const getAccessToken = async () => {
  const now = Date.now();

  if (accessToken && now < tokenExpiresAt) {
    // Token aún válido, reutilizarlo
    return accessToken;
  }

  // Solicitar token nuevo
  const authString = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) throw new Error('Error al obtener token');

    const data = await response.json();

    accessToken = data.access_token;
    tokenExpiresAt = now + data.expires_in * 1000; // expires_in está en segundos

    return accessToken;
  } catch (error) {
    console.error('Error al obtener token de acceso:', error);
    throw error;
  }
};

export const getTopArtistsFromSpain = async () => {
  try {
    const token = await getAccessToken();
    const playlistId = '3O5cscCkI0ZuGuGRSJTqnv'; // Top 50 España

    // Obtener tracks de la playlist
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error('Error al obtener la playlist');

    const data = await response.json();
    const tracks = data.items;

    // Extraer artistas únicos (máx. 10)
    const artistMap = new Map();

    for (let track of tracks) {
      const artist = track.track?.artists?.[0]; // artista principal
      if (artist && !artistMap.has(artist.id)) {
        artistMap.set(artist.id, artist.name);
      }
      if (artistMap.size >= 10) break;
    }

    const uniqueArtists = Array.from(artistMap.entries());

    // Obtener imagen de cada artista
    const results = await Promise.all(
      uniqueArtists.map(async ([id, name]) => {
        const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return null;
        const artistData = await res.json();

        return artistData.images?.[0]?.url
          ? {
              name: artistData.name,
              image: artistData.images[0].url,
            }
          : null;
      })
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error('Error al obtener artistas top de España:', error);
    return [];
  }
};
