import {useEffect} from 'react'

export function useKeyDown(key, action) {
  useEffect(function () {
    function callBack (e)  {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", callBack)
    return () => { document.removeEventListener("keydown", callBack) }
  }, [key,action])
}

