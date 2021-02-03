import React, { useEffect, useReducer } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import Axios from "axios"
import Spinner from "../layout/Spinner"

function reducer(state, action) {
  switch (action.type) {
    case "LYRICS":
      return {
        ...state,
        lyrics: action.value,
        loading: false
      }
    case "ERROR":
      return {
        ...state,
        errorMessage: action.value,
        loading: false
      }
    case "SEARCH":
      return {
        ...state,
        loading: true,
        errorMessage: ""
      }
    default:
      break
  }
}

function Lyrics() {
  const trackId = useParams().id
  const data = useLocation() // Link Props from SingleTrack.js
  const { track_name, artist_name, album_id, album_name } = data.state.track

  const initialState = {
    lyrics: {},
    loading: false,
    errorMessage: ""
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: "SEARCH" })
    const ourRequest = Axios.CancelToken.source()
    async function fetchLyrics() {
      try {
        //const response = await Axios.get(`https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${process.env.MM_KEY}`)
        const response = await Axios.get(`https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=96d992b7c28874271070d7ea55e2a9c8`)

        if (response.status === 200 && response.data.message.body.lyrics.lyrics_body != "") {
          dispatch({ type: "LYRICS", value: response.data.message.body.lyrics })
        } else {
          dispatch({ type: "ERROR", value: "Lyrics Not Found" })
        }
      } catch (e) {
        dispatch({ type: "ERROR", value: "Error while fetching lyrics" })
        console.log("Error while fetching lyrics: ", e)
      }
    }
    fetchLyrics()

    return () => {
      ourRequest.cancel() // cleanup
    }
  }, [])

  return (
    <>
      <Link to="/" className="btn btn-dark btn-sm mb-4">
        Go Back{" "}
      </Link>
      {state.loading && <Spinner />}
      {state.errorMessage && (
        <div className="m-2">
          <span className="text-danger">{state.errorMessage}</span>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <span className="text-info span-title">
            {track_name}
            {"  "}
          </span>
          by <span className="text-secondary span-subtitle"> {artist_name}</span>
        </div>
        <div className="card-body">
          <p className="card-text">{state.lyrics.lyrics_body}</p>
        </div>
      </div>
      <ul className="list-group mt-3">
        <li className="list-group-item">
          <span className="text-secondary">Album Name: </span>
          <strong>{album_name}</strong>
        </li>
        <li className="list-group-item">
          <span className="text-secondary">Album ID: </span>
          <strong>{album_id}</strong>
        </li>
        <li className="list-group-item">
          <span className="text-secondary">Song Genre: </span>
          <strong>{data.state.genre}</strong>
        </li>
      </ul>
    </>
  )
}

export default Lyrics
