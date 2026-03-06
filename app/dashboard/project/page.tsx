import ProjectCard from "@/components/dashboard/Card"

export default function Project() {

  const projects = [
    { id: 1, title: "Repo Flux", description: "A high-performance repository management tool built with Next.js and Supabase.", tags: ["Next.js", "Auth"], imageUrl: "" },
    { id: 2, title: "Nexus UI", description: "A beautiful component library for modern dashboard design.", tags: ["Tailwind", "React"], imageUrl: "" },
    { id: 3, title: "DevFlow", description: "Streamlining developer workflows with AI-powered task automation.", tags: ["AI", "Node.js"], imageUrl: "" },
    { id: 4, title: "Repo Flux", description: "A high-performance repository management tool built with Next.js and Supabase.", tags: ["Next.js", "Auth"], imageUrl: "" },
    { id: 5, title: "Nexus UI", description: "A beautiful component library for modern dashboard design.", tags: ["Tailwind", "React"], imageUrl: "" },
    { id: 6, title: "DevFlow", description: "Streamlining developer workflows with AI-powered task automation.", tags: ["AI", "Node.js"], imageUrl: "" },
    // Add more items to see the grid in action...
  ];
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
        {projects.map((project) => (
          <div key={project.id} className="flex justify-center">
            <ProjectCard 
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
            />
          </div>
        ))}
      </div>

      {/* 3. Empty State (Expert Tip) */}
      {projects.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-gray-500">No projects found. Be the first to upload!</p>
        </div>
      )}
    </section>
  );
}
