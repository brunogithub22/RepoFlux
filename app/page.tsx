import Link from "next/link";
import { Cpu, Code2, Zap, ArrowRight, Github, Mail } from "lucide-react";

export default function HybridPortfolio() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      
      {/* 1. THE VISION */}
      <section className="mb-20">
        <h1 className="text-6xl font-bold tracking-tighter mb-6">
          Bridging the gap between <br />
          <span className="text-blue-600">Bits and Atoms.</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          My work at <span className="font-bold text-black dark:text-white">RepoFlux </span> 
           explores the intersection of high-level software architecture and low-level electronic systems.
        </p>
      </section>

      {/* 2. THE DUALITY (Software vs Electronics) */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Software Card */}
        <div className="p-10 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-start">
          <Code2 className="w-10 h-10 text-blue-600 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Software Systems</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Scalable web platforms, cloud infrastructure, and intelligent automation tools 
            built for performance and reliability.
          </p>
          <div className="flex gap-4 mt-4 ">
            <Link 
              href="/software" 
              className="flex items-center gap-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-all"
            >
              View Software
               <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Electronics Card */}
        <div className="p-10 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Cpu className="w-10 h-10 text-orange-500 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Electronics & Hardware</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Embedded systems, PCB design, and IoT prototyping. Turning physical 
            concepts into functional hardware.
          </p>
          <div className="flex gap-4 mt-4">
            <Link 
              href="/project" 
              className="flex items-center gap-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-all"
            >
              View Project
               <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}