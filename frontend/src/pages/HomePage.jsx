import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import NavBar from "../components/NavBar";
import Feed from "../components/Feed";
import Map from "../components/Map";

export default function HomePage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <Feed />
      <Map />
    </>
  );
}
