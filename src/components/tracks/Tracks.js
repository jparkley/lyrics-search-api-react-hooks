import React, { useContext } from "react"
import StateContext from "../../StateContext"
import SingleTrack from "./SingleTrack"

function Tracks() {
  const appState = useContext(StateContext)

  return (
    <>
      <h3 className="text-center mb-4">{appState.heading}</h3>
      <div className="row">
        {appState.track_list.map(item => {
          return <SingleTrack key={item.track.track_id} track={item.track} />
        })}
      </div>
    </>
  )
}

export default Tracks
