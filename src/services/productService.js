import {
  deleteAllProducts,
  insertManyProducts,
} from '../repositories/productRepository.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export async function seedProductsService() {
  await deleteAllProducts();

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    const err = new Error('Falta TMDB_API_KEY en .env');
    err.statusCode = 500;
    throw err;
  }

  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

  let tmdbResponse;
  try {
    tmdbResponse = await fetch(url);
  } catch (fetchErr) {
    const err = new Error('Error al conectar con TMDB');
    err.statusCode = 502;
    throw err;
  }

  if (!tmdbResponse.ok) {
    const err = new Error('Error obteniendo datos de TMDB');
    err.statusCode = tmdbResponse.status || 502;
    throw err;
  }

  const data = await tmdbResponse.json();
  const movies = data.results;

  const productsToInsert = movies.map((movie) => {
    const price = Number((Math.random() * (50 - 5) + 5).toFixed(2));

    const genres = movie.genre_ids
      .map((id) => genreMap[id])
      .filter((g) => typeof g === 'string');

    return {
      title: movie.title,
      overview: movie.overview,
      image: movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : '',
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      price,
      tmdbId: movie.id,
      genres,
    };
  });

  const inserted = await insertManyProducts(productsToInsert);

  return { insertedCount: inserted.length };
}
