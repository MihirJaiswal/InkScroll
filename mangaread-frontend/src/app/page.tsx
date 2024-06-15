import Image from "next/image";
import Manga from "./components/Manga";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RandomMangaList from "./components/HomeMangas";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <Hero/>
    <RandomMangaList/>
    <Footer/>
  </div>
  );
}
