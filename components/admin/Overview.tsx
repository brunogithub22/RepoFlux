import React, { useState, useEffect } from 'react';
import { FileText, Eye, MessageSquare, Plus, LucideIcon } from 'lucide-react';

// --- Main Component: Overview (Self-Fetching) ---
export default function Overview() {
  // 1. Initialize state inside the component
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data on mount
  useEffect(() => {
    async function loadDashboardData() {
      
    }

    loadDashboardData();
  }, []);

  // 3. Loading State (Crucial for UX)
  if (loading) {
    return <div className="p-6 text-zinc-500">Loading your dashboard...</div>;
  }

  // Derived stats
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'Published').length;

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="bg-blue-600 px-5 py-2.5 rounded-xl">+ New Post</button>
      </div>

      {/* 1. Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Posts" value={totalPosts} Icon={FileText} color="text-blue-400" />
        <StatCard title="Published" value={publishedCount} Icon={Eye} color="text-emerald-400" />
        <StatCard title="Feedback" value={0} Icon={MessageSquare} color="text-purple-400" />
      </div>

      {/* 2. Posts Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/30 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-800/40">
                <td className="p-4">{post.title}</td>
                <td className="p-4">{post.status}</td>
                <td className="p-4 text-right">
                   <button className="text-zinc-400 hover:text-white">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// StatCard stays the same as before...
function StatCard({ title, value, Icon, color }: { title: string, value: number, Icon: LucideIcon, color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
      <div className={`p-3 bg-zinc-800 rounded-lg ${color}`}><Icon size={24} /></div>
      <div>
        <p className="text-zinc-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}