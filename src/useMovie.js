import { useState, useEffect } from "react";
const KEY = "1eeeac52";

export function useMovie(query){
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(function () {

    const controller = new AbortController();
    //for using this controller we have to put it in fetch request as a second arguments

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const fetching = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal })
        if (!fetching.ok) throw new Error("This is Being arise due to data disconection");
        /*If while fetching data user internet connection get lost then this is error goes to the catch */
        const res = await fetching.json();
        if (res.Response === "False") throw new Error("Movie not found")
        const data = res.Search;
        setMovies(data);
        // setError("");
      }
      catch (er) {
        console.log(er.message)
        if (er.name !== "AbortError") {
          setError(er.message)
        }
      }
      finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseSelectedMovie();
    fetchMovies();

    // cleanup function
    return function () {
      controller.abort();
    }

  }, [query]);

  return {movies, isLoading, error}
}
