import {useState, useEffect} from 'react'

// for better reusing this function we have to pass some common parameters
export function useLocalStorage(initalState,key) {
  const [watched, setWatched] = useState(function () {
    const storedMovies = localStorage.getItem(key)
    // console.log(storedMovies)
    // If user provides a key which is not valid so the value of the storedMovie will be null and effect ui so we provide an intial state which is [] in our case;
      return storedMovies?JSON.parse(storedMovies):initalState
    })

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify([...watched]));
    }, [watched, key])

    return {watched,setWatched};
}


