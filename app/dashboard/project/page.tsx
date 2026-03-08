"use client";

import ProjectCard from "@/components/dashboard/Card"
import { BasePost } from "@/components/intefaces";
import { useEffect, useState } from "react";

export default function Project() {

  const [Post,setPost] = useState<BasePost[]>([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    getPosts();
  },[]) 

  const getPosts = async () =>{
    setPost([]);
    const actionName = "getPosts";
      try {
        const response = await fetch('/api/drizzle/helper/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionName, payload: {} }),
        });
        const result = await response.json();
        if (response.ok) {
           const allPosts = Array.isArray(result.result) ? result.result : [];

           // ✅ 1. Filter the entire list at once
          const filteredPosts = allPosts.filter((post: BasePost) => 
            post.published && post.type === "Project"
          );

          // ✅ 2. Set the state ONCE with the new array (don't use ...prev)
          setPost(filteredPosts);

        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user languages:", error);
      }
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Explore Projects
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">
            Discover the latest contributions from our community.
          </p>
        </div>
        
      </div>

      {/* 2. The Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Post.map((project) => (
          <div key={project.id} className="flex justify-center">
            <ProjectCard 
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.icon}
              id = {project.id}
              type= {project.type}
            />
          </div>
        ))}
      </div>

      {/* 3. Empty State (Expert Tip) */}
      {Post.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </section>
  );
}
