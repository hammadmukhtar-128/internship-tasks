"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/authClient";
import { Blog, PaginatedResponse } from "@/types";
import { HiOutlineTrash } from "react-icons/hi";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const load = () => {
    api.get<PaginatedResponse<Blog>>("/blogs?limit=50").then((r) => setBlogs(r.data)).catch(() => {});
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    const session = getSession();
    if (!session || !confirm("Remove this blog post?")) return;
    await api.delete(`/blogs/${id}`, session.token);
    load();
  };

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-bold text-ink">Blog Posts</h1>
      <p className="mt-1 text-sm text-ink/50">
        Use the <code>/api/blogs</code> POST endpoint (same pattern as Properties) to publish new posts, or extend
        this page with a create form.
      </p>
      <div className="card-luxury mt-6 divide-y divide-ink/5">
        {blogs.map((b) => (
          <div key={b._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">{b.title}</p>
              <p className="text-xs text-ink/50">{b.category}</p>
            </div>
            <button onClick={() => remove(b._id)} className="text-red-500 hover:text-red-700">
              <HiOutlineTrash />
            </button>
          </div>
        ))}
        {blogs.length === 0 && <p className="p-6 text-center text-ink/40">No blog posts yet.</p>}
      </div>
    </AdminGuard>
  );
}
