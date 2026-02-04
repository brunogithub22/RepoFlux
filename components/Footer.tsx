import Image from "next/image";

export default function Footer(){
    return(
        <footer className="p-4 bg-gray-800 text-white text-center">
            <div className="py-2">
                <div className="flex space-x-4 justify-center mb-4">
                    <Image src="/social/facebook.svg" width={24} height={24} alt="Facebook" loading="eager" />
                    <Image src="/social/youtube.svg" width={24} height={24} alt="Facebook" loading="eager" />
                    <Image src="/social/instagram.svg" width={24} height={24} alt="Facebook" loading="eager" />
                    <Image src="/social/whatsapp.svg" width={24} height={24} alt="Facebook" loading="eager" />
                </div>
                <span className="text-sm">&copy; {new Date().getFullYear()} RepoFlux. All rights reserved.</span>
            </div>
        </footer>
    );
}