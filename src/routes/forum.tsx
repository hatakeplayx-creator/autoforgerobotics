import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";
import { MessageSquare, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threads: number;
  posts: number;
  lastPost: string;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
}

export const Route = createFileRoute("/forum")({
  component: ForumPage,
});

function ForumPage() {
  const [search, setSearch] = useState("");

  const categories: ForumCategory[] = [
    {
      id: "1",
      name: "General Discussion",
      description: "General chat about robotics, electronics and DIY projects",
      threads: 42,
      posts: 156,
      lastPost: "2 hours ago",
    },
    {
      id: "2",
      name: "Development Boards",
      description: "Discussions about Arduino, Raspberry Pi, ESP32, and more",
      threads: 78,
      posts: 324,
      lastPost: "5 hours ago",
    },
    {
      id: "3",
      name: "3D Printing",
      description: "Everything about 3D printers, slicers, filaments and troubleshooting",
      threads: 56,
      posts: 231,
      lastPost: "1 day ago",
    },
    {
      id: "4",
      name: "Drones & UAVs",
      description: "Drone building, flight controllers, parts and regulations",
      threads: 34,
      posts: 145,
      lastPost: "2 days ago",
    },
    {
      id: "5",
      name: "Sensors & Modules",
      description: "Questions about sensors, modules and interfacing",
      threads: 67,
      posts: 289,
      lastPost: "3 days ago",
    },
    {
      id: "6",
      name: "Project Showcase",
      description: "Show off your latest projects and get feedback",
      threads: 98,
      posts: 412,
      lastPost: "4 days ago",
    },
  ];

  const threads: ForumThread[] = [
    {
      id: "t1",
      title: "Help with ESP32 Wi-Fi connection issues",
      author: "MakerJohn",
      replies: 12,
      views: 345,
      lastReply: "1 hour ago",
    },
    {
      id: "t2",
      title: "Ender 3 V3 KE first impressions",
      author: "3DPrintFan",
      replies: 24,
      views: 678,
      lastReply: "3 hours ago",
    },
    {
      id: "t3",
      title: "Best budget motor drivers for robotics projects",
      author: "RoboBuilder",
      replies: 8,
      views: 234,
      lastReply: "6 hours ago",
    },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Community Forum</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with fellow makers, ask questions, and share knowledge.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search forum..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">Categories</h2>
            </div>
            <div className="divide-y divide-border">
              {filteredCategories.map((category) => (
                <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold text-foreground">{category.threads}</p>
                      <p>Threads</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">{category.posts}</p>
                      <p>Posts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">{category.lastPost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">Recent Threads</h2>
            </div>
            <div className="divide-y divide-border">
              {threads.map((thread) => (
                <div key={thread.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{thread.title}</h3>
                      <p className="text-sm text-muted-foreground">Started by {thread.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold text-foreground">{thread.replies}</p>
                      <p>Replies</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">{thread.views}</p>
                      <p>Views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">{thread.lastReply}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorePageShell>
  );
}
