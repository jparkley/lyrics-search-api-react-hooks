import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"
import Spinner from "../layout/Spinner"

function Search() {
  const appDispatch = useContext(DispatchContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false) // Use local loading

  function onSubmit(e) {
    e.preventDefault()
    appDispatch({ type: "SEARCH_START" })
    setLoading(true)
    async function fetchTracks() {
      try {
        const response = await Axios.get(`https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_track=${searchTerm}&page_size=10&page=1&s_track_rating=desc&apikey=${process.env.MM_KEY}`)
        console.log("in search: ", response)

        if (response) {
          if (response.data.message.header.status_code == 401) {
            appDispatch({ type: "ERROR", value: "API Calls have reached max quota." })
          } else {
            const newList = response.data.message.body.track_list.filter(item => item.track.explicit === 0)
            appDispatch({ type: "SEARCH_RESULT", value: { track_list: newList, heading: "Search Results for " + searchTerm } })
          }
        } else {
          appDispatch({ type: "ERROR", value: "There is an error making an API call" })
        }
      } catch (e) {
        appDispatch({ type: "ERROR", value: e })
        console.log(e)
      }
    }
    fetchTracks()
    setLoading(false)
  }

  return (
    <>
      <div className="card card-body m-4 p-4">
        <h1 className="display-4 text-center">
          <i className="fas fa-music"></i> Search for Song Lyrics
        </h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" onChange={e => setSearchTerm(e.target.value)} name="searchTerm" value={searchTerm} placeholder="Please enter song title." className="form-control lg" />
            <button className="btn btn-primary btn-lg btn-block mb-2 mt-2" type="submit">
              Get Track Lyrics
            </button>
          </div>
        </form>
        {loading && <Spinner />}
      </div>
    </>
  )
}

export default Search
