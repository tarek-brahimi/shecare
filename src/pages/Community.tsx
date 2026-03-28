import { CreatePostCard, PostsFeed } from "@/features/community";

export default function Community() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your story and connect with others</p>
      </div>
      <CreatePostCard />
      <PostsFeed />
    </div>
  );
}
