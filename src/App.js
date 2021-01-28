import React, { useEffect, useReducer } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Axios from "axios"
//import dotenv from "dot-env"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import Header from "./components/layout/Header"
import Spinner from "./components/layout/Spinner"
import ErrorMessage from "./components/layout/ErrorMessage"
import Tracks from "./components/tracks/Tracks"
import Lyrics from "./components/tracks/Lyrics"
import Search from "./components/tracks/Search"

//dotenv.config()

function App() {
  const initialState = {
    track_list: [],
    heading: "Top Tracks",
    loading: true,
    error: false,
    errorMessage: ""
  }

  function reducer(state, action) {
    switch (action.type) {
      case "SEARCH_START":
        return {
          ...state,
          loading: true,
          error: false,
          errorMessage: ""
        }
      case "SEARCH_RESULT":
        return {
          ...state,
          track_list: action.value.track_list,
          heading: action.value.heading,
          loading: false
        }
      case "TOP_TRACKS_RESULT":
        return {
          ...state,
          track_list: action.value,
          loading: false
        }
      case "ERROR":
        return {
          ...state,
          errorMessage: action.value,
          loading: false,
          error: true
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    dispatch({ type: "SEARCH_START" })
    async function fetchTracks() {
      try {
        //console.log("key:", process.env.MM_KEY)
        //const response = await Axios.get(`https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=30&country=us&f_has_lyrics=1&apikey=${process.env.MM_KEY}`)
        const response = await Axios.get(`https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=30&country=us&f_has_lyrics=1&apikey=49c88f13210df1606bd82b58fc6337ae`)
        console.log("top tracks: ", response)
        if (response) {
          if (response.data.message.header.status_code == 401) {
            dispatch({ type: "ERROR", value: "API Calls have reached max quota." })
          } else {
            const newList = response.data.message.body.track_list.filter(item => item.track.explicit === 0)
            dispatch({ type: "TOP_TRACKS_RESULT", value: newList })
          }
        } else {
          dispatch({ type: "ERROR", value: "There is an error making an API call" })
        }
      } catch (e) {
        dispatch({ type: "ERROR", value: e })
        console.log(e)
      }
    }
    fetchTracks()

    return () => {
      ourRequest.cancel() // cleanup
    }
  }, [])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Router>
          <div className="container">
            <Header />
            {state.loading ? (
              <Spinner />
            ) : (
              <Switch>
                <Route exact path="/">
                  <Search />
                  <Tracks />
                </Route>

                <Route exact path="/lyrics/track/:id" component={Lyrics} />
              </Switch>
            )}
            {state.errorMessage && <ErrorMessage />}
          </div>
        </Router>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
