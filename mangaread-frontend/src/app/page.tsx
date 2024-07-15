import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RandomMangaList from "../components/HomeMangas";
import GenresDisplay from "../components/GenresDisplay";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <Hero/>
    <RandomMangaList/>
    <GenresDisplay/>
    <Footer/>
  </div>
  );
}
