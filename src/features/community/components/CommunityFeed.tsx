import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPosts } from "@/services/api";
import { SheCard } from "@/ui/Card";
import { SheTextArea } from "@/ui/TextArea";
import { SheButton } from "@/ui/Button";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { timeAgo } from "@/utils/helpers";
import { TAG_OPTIONS } from "@/utils/constants";

const tagColors: Record<string, string> = {
  Victory: "bg-shecare-green-light text-shecare-green",
  Support: "bg-shecare-blue-light text-shecare-blue",
  Question: "bg-shecare-orange-light text-shecare-orange",
  Advice: "bg-shecare-purple-light text-shecare-purple",
  Story: "bg-shecare-pink-light text-primary",
};

export function CreatePostCard() {
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setContent("");
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    await createPostMutation.mutateAsync({
      content: content.trim(),
      tags: selectedTags,
    });
  };

  return (
    <SheCard>
      <h3 className="text-sm font-semibold text-foreground mb-3">Share Your Story</h3>
      <SheTextArea
        rows={3}
        placeholder="How are you feeling today? Share your experience..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTags.includes(tag)
                  ? tagColors[tag] || "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <SheButton
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </SheButton>
      </div>
      {createPostMutation.isError && (
        <p className="text-xs text-destructive mt-2">Could not publish your post. Please try again.</p>
      )}
    </SheCard>
  );
}

export function PostsFeed() {
  const { data: posts, isLoading, isError } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <SheCard key={i} className="animate-pulse">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-1" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </SheCard>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <SheCard className="text-center py-12">
        <p className="text-destructive">Could not load posts right now.</p>
      </SheCard>
    );
  }

  if (!posts?.length) {
    return (
      <SheCard className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
      </SheCard>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <SheCard key={post.id}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full shecare-gradient flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
              {post.authorAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{post.authorName}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
              </div>
              <div className="flex gap-1.5 mt-1">
                {post.tags.map((tag) => (
                  <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColors[tag] || "bg-muted text-muted-foreground"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">{post.content}</p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
              <FiHeart className="w-4 h-4" /> {post.likes}
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-shecare-blue transition-colors">
              <FiMessageCircle className="w-4 h-4" /> {post.comments}
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-shecare-green transition-colors">
              <FiShare2 className="w-4 h-4" /> {post.shares}
            </button>
          </div>
        </SheCard>
      ))}
    </div>
  );
}
