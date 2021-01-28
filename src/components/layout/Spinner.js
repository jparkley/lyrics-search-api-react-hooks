import React from "react"
import spinner from "./spinner.gif"

function Spinner() {
  console.log("in spinner")
  return (
    <>
      <img src={spinner} alt="loading... " className="spinner" />
    </>
  )
}

export default Spinner
