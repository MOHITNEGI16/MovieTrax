import { useEffect, useRef, useState } from "react";
import Rating from "./Rating";
import { useMovie } from "./useMovie";
import { useLocalStorage } from "./useLocalStorage";
import { useKeyDown } from "./useKeyDown";
const KEY = "1eeeac52";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   // {
//   //   imdbID: "tt1375666",
//   //   Title: "Inception",
//   //   Year: "2010",
//   //   Poster:
//   //     "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   //   runtime: 148,
//   //   imdbRating: 8.8,
//   //   userRating: 10,
//   // },
//   // {
//   //   imdbID: "tt0088763",
//   //   Title: "Back to the Future",
//   //   Year: "1985",
//   //   Poster:
//   //     "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//   //   runtime: 116,
//   //   imdbRating: 8.5,
//   //   userRating: 9,
//   // },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


export default function App() {
  const [query, setQuery] = useState("");
  const [selecteId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);

  // these are custom hooks here
  const {movies, isLoading, error} = useMovie(query);
  const {watched,setWatched} = useLocalStorage([],'watchedMovie');



  const handleMovieId = (id) => {
    setSelectedId(selecteId => (id === selecteId ? null : id));
  }
  const handleCloseSelectedMovie = () => {
    setSelectedId(null);
  }
  const handleWatcheMovies = (movieObject) => {
    setWatched(watched => [...watched, movieObject]);
  }
  const handleDeletedWatchedMovie = (id) => {
    setWatched((watched) => watched.filter(ele => ele.imdbID !== id))
  }


  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>

        <Box >
          {/* {isLoading ? <Loader/> :<MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleMovieId} />}
          {error && <ErrMessage message={error} />}
        </Box>

        <Box>
          {
            selecteId ?
              <SelectedMovie watched={watched} selecteId={selecteId} onClosingMovie={handleCloseSelectedMovie} onWatchedMovie={handleWatcheMovies} /> :
              <>
                <MovieSummary watched={watched} />
                <WatchedMovies watched={watched} onMovieDeletion={handleDeletedWatchedMovie} />
              </>
          }

        </Box>

      </Main>
    </>
  );
}

function SelectedMovie({ watched, selecteId, onClosingMovie, onWatchedMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.map((movie) => movie.imdbID).includes(selecteId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actor,
    Director: director,
    Genre: genre
  } = movie


  function handleMovieAdd() {
    const newMovies = {
      imdbID: selecteId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    }
    onWatchedMovie(newMovies);
    onClosingMovie();
  }

useKeyDown("Escape",onClosingMovie)


  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const fetching = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selecteId}`);
      const res = await fetching.json();
      setMovie(res);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selecteId])

  useEffect(function () {
    if (!title) return;
    document.title = title;

    return () => { document.title = "MovieT-Rax   📽"; console.log("movie name is something like", title) }
  }, [title])

  return (
    <>
      {isLoading ? <Loader /> :

        <div className="details">
          <header>
            <button className="btn-back" onClick={onClosingMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐ </span> {imdbRating}  IMDB rating</p>
            </div>

          </header>

          <section>
            <div className="rating">
              {
                !isWatched ?
                  <>
                    <Rating maxRating={10} size={20} onSetRating={setUserRating} />
                    {userRating > 0 && <button className="btn-add" onClick={handleMovieAdd}> +Add to list</button>}
                  </> :
                  <p>You already added this movie in watched list</p>
              }
            </div>
            <p><em>{plot}</em></p>
            <p>Staring {actor}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      }
    </>



  )
}

function Loader() {
  return (
    <p className="loader">Loading.....</p>
  )
}
function ErrMessage({ message }) {
  return (
    <p className="error"><span>🚫</span>{message}</p>
  )
}
function Navbar({ children }) {

  return (
    <nav className="nav-bar">
      {children}
    </nav>
  );
}

// Navbar's component 
function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </>
  )
}

function Search({ query, setQuery }) {
  const inputFocus = useRef(null);
  useKeyDown("Enter",function(){
    if(document.activeElement === inputFocus)return;
    inputFocus.current.focus()
  })



  
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputFocus /**here we connected out inputFocus ref */}
      />
    </>
  )
}

function NumResults({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </>
  )
}


// Main Component 

function Main({ children }) {

  return (
    <>
      <main className="main">
        {children}
      </main>
    </>
  );
}

// Main's Component
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

// MovieListBox Components
function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}


// Watched Movie List
/*
function WatchedMovieListBox() {

  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>

        </>
      )}
    </div>
  )


}
 */

// WathcedMovieListBox's component
function MovieSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(1);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(1);


  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMovies({ watched, onMovieDeletion }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onMovieDeletion={onMovieDeletion} />
      ))}
    </ul>
  )
}


function WatchedMovie({ movie, onMovieDeletion }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onMovieDeletion(movie.imdbID)}>X</button>
      </div>
    </li>
  )
}
