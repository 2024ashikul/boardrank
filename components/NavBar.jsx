'use client';
import Link from "next/link"
import { useState } from "react";



export default function NavBar(){
    const [filter , setFilter] = useState(null);
    const [search , setSearch] = useState('');
    return (
        <>
            <div className="flex gap-4 text-2xl  bg-blue-100 mt-0 mb-4 py-2">
                <Link href={`/page/1`}>Board Result Rank</Link>


                <input type="search" id="search" className="border" onChange={(e) => setSearch(e.target.value)} placeholder="Search" /> 
                <input type="radio" id="name" className="border" onChange={(e)=> setFilter(e.target.value)}  name="filter" placeholder="Search" value={'name'}/>
                <label htmlFor="name">Name</label>
                <input type="radio" id="roll" className="border" onChange={(e)=> setFilter(e.target.value)} name="filter" placeholder="Search" value={'roll'}/>
                <label htmlFor="roll">Roll</label>
                <input type="radio" id="school" className="border" onChange={(e)=> setFilter(e.target.value)} name="filter" placeholder="Search" value={'institute'}/>
                <label htmlFor="school">School</label>
                <Link href={`/search/${filter}/${encodeURIComponent(search)}`}>Submit</Link>
                
            </div>        
        </>
    )
}