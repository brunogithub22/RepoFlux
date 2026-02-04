import Image from "next/image";

export default function NavBar(){
    return(
        <nav className="flex items-center p-4 bg-gray-800 text-white">
            <div className="flex ml-2 items-center">
                <Image src="icon.svg" width={32} height={32} alt="Logo" loading="eager" className="rounded-full" />
                <span className="ml-2 font-bold text-lg">RepoFlux</span>
            </div>
            
        </nav>
    );
}