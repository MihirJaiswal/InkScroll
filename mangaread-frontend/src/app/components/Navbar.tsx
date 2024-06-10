import React from 'react';

function Navbar() {
    return (
        <div className="bg-bgmain text-white p-4 ">
            <nav className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <a href="#home" className="text-sm font-semibold mr-4">Home</a>
                    <a href="#latest" className="text-sm font-semibold mr-4">My Manga</a>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
