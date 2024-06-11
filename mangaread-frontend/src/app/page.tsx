import Image from "next/image";
import Manga from "./components/Manga";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <Hero/>
    <Manga/>
    <Footer/>
  </div>
  );
}
