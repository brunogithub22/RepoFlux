"use client"
import React from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { ProjectCardProps } from '../intefaces';
import Link from 'next/link';

const ProjectCard = ({ title, description, tags, imageUrl, id, type }: ProjectCardProps) => {

  const types = type.charAt(0).toLowerCase() + type.slice(1)

  return (
    <div className="group relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
      
      {/* 1. Image / Placeholder Section */}
      <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-700">
             <Github size={48} strokeWidth={1} />
          </div>
        )}
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Content Section */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-6">
          {description}
        </p>

        {/* 3. The "View" Button Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
          
         
          <Link 
            key={id} href={`/dashboard/${types}/${id}`}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Eye size={18} />
            <span>View Project</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;