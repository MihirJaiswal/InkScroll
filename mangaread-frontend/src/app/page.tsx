import Image from "next/image";
import Manga from "./components/Manga";
import SortedMangaByGenre from "./components/SortedMangaByGenre";

export default function Home() {
  return (
  <div>
    <Manga/>
    <SortedMangaByGenre/>
  </div>
  );
}
