import Image from "next/image";
import Manga from "./components/Manga";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <Hero/>
    <Manga/>
  </div>
  );
}
