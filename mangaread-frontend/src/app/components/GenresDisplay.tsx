// GenresDisplay.tsx
'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const genres = [
  { name: 'Action', imageSrc: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/03/pjimage-116.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5' },
  { name: 'Adventure', imageSrc: 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/a249096c7812deb8c3c2c907173f3774.jpe' },
  { name: 'Comedy', imageSrc: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/06/Miyuki-Kaguya-Sama-Love-is-War.jpg?q=50&fit=crop&w=750&dpr=1.5' },
  { name: 'Drama', imageSrc: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/11/drama-anime-hulu.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5' },
  { name: 'Fantasy', imageSrc: 'https://i.ytimg.com/vi/0syCiGzNQGk/maxresdefault.jpg' },
  { name: 'Romance', imageSrc: 'https://imgix.ranker.com/list_img_v2/7470/1927470/original/1927470-u2?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=418.848167539267&w=800' },
  { name: 'Horror', imageSrc: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/10/Japanese-Horror-Manga.png?q=50&fit=contain&w=1140&h=&dpr=1.5' },
  { name: 'Slice of Life', imageSrc: 'https://images.lifestyleasia.com/wp-content/uploads/sites/6/2023/11/21143451/best-romantic-anime-series-my-dress-up-darling.png?tr=w-1600' },
  { name: 'Mystery', imageSrc: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/09/Horror-Manga-Monsters.jpg' },
  { name: 'sports', imageSrc: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/01/Anime-like-Haikyuu.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5'},
  { name: 'Sci-Fi', imageSrc: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1fb896dd-cba1-4c09-89c7-c7178a830305/dh0xw6c-364763e9-982d-4085-a1a1-da690bcaef22.png/v1/fill/w_1095,h_730,q_70,strp/sci_fi_manga_scene_3_by_obsidianplanet_dh0xw6c-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU0IiwicGF0aCI6IlwvZlwvMWZiODk2ZGQtY2JhMS00YzA5LTg5YzctYzcxNzhhODMwMzA1XC9kaDB4dzZjLTM2NDc2M2U5LTk4MmQtNDA4NS1hMWExLWRhNjkwYmNhZWYyMi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GW5WVtdrktNwRhO3aSY2SrjDLHkzbwYklFDc-JuqoQI' },
  { name: 'Thriller', imageSrc: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/best-thriller-anime-featured-image-featuring-side-by-side-images-of-perfect-blue-death-note-and-steins-gate.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5' },
];

const GenresDisplay: React.FC = () => {
  const router = useRouter();

  const handleGenreClick = (genre: string) => {
    router.push(`/genres/${genre}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-200">
      <h1 className="text-4xl font-bold mb-16 text-center md:text-left">Explore Genres</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-8 gap-4">
        {genres.map((genre) => (
          <div
            key={genre.name}
            className="flex flex-col items-center justify-center md:p-4 p-1 bg-gray-950 md:bg-bgcard border border-gray-500 rounded-md shadow-lg cursor-pointer hover:bg-gray-800"
            onClick={() => handleGenreClick(genre.name)}
          >
            <img src={genre.imageSrc} alt={genre.name} width={150} height={150} className="md:rounded-lg h-full w-auto object-cover" />
            <p className="mt-2 md:text-lg text-sm p-2 font-semibold text-center">{genre.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresDisplay;
