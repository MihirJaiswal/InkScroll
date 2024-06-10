import Image from "next/image";
import Manga from "./components/Manga";
import Hero from "./components/Hero";
import SortedMangaByGenre from "./components/SortedMangaByGenre";

export default function Home() {
  return (
  <div>
    <Hero/>
    <Manga/>
    <SortedMangaByGenre/>
  </div>
  );
}
