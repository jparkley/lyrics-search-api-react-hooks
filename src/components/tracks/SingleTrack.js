import React from "react"
import { Link } from "react-router-dom"

function SingleTrack(props) {
  const { track } = props
  let genre = ""
  if (track.primary_genres.music_genre_list.length > 0) {
    genre = track.primary_genres.music_genre_list[0].music_genre.music_genre_name
  }

  return (
    <>
      <div className="col-md-6">
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h3>{track.artist_name}</h3>
            <p className="card-text">
              <i className="fas fa-play"></i>
              <strong> Track: </strong>
              {track.track_name} <br />
              <i className="fas fa-play"></i>
              <strong> Album: </strong>
              {track.album_name}
              <br />
            </p>
            <Link
              to={{
                pathname: `/lyrics/track/${track.track_id}`,
                state: {
                  track: track,
                  genre: genre
                }
              }}
              className="btn btn-secondary btn-sm btn-block"
            >
              <i className="fas fa-chevron-right"></i> View Lyrics
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleTrack
