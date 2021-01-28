import React, { useContext } from "react"
import StateContext from "../../StateContext"

function ErrorMessage() {
  const appState = useContext(StateContext)
  return (
    <>
      <div className="container mb-2 text-center">
        <h3 className="text-danger"> {appState.errorMessage}</h3>
      </div>
    </>
  )
}

export default ErrorMessage
