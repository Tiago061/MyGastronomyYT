import NavBar from "./components/navbar/navbar"
import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

