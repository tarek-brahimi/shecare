import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentOnPost, createPost, getPosts, likePost, sharePost } from "@/services/api";
import { getApiErrorMessage } from "@/services/api";
import { useAuth } from "@/context/useAuth";
import { SheCard } from "@/ui/Card";
import { SheTextArea } from "@/ui/TextArea";
import { SheButton } from "@/ui/Button";
import { SheInput } from "@/ui/Input";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { timeAgo } from "@/utils/helpers";
import { MAX_POST_LENGTH, TAG_OPTIONS } from "@/utils/constants";
import { toast } from "sonner";

const tagColors: Record<string, string> = {
  Victory: "bg-shecare-green-light text-shecare-green",
  Support: "bg-shecare-blue-light text-shecare-blue",
  Question: "bg-shecare-orange-light text-shecare-orange",
  Advice: "bg-shecare-purple-light text-shecare-purple",
  Story: "bg-shecare-pink-light text-primary",
};

export function CreatePostCard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    if (trimmedContent.length > MAX_POST_LENGTH) {
      toast.error(`Post is too long. Max ${MAX_POST_LENGTH} characters.`);
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag.");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: trimmedTitle,
        content: trimmedContent,
        tags: selectedTags,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not publish your post. Please try again."));
    }
  };

  return (
    <SheCard>
      <h3 className="text-sm font-semibold text-foreground mb-3">Share Your Story</h3>
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all mb-3"
      />
      <SheTextArea
        rows={3}
        placeholder="How are you feeling today? Share your experience..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX_POST_LENGTH}
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
          disabled={!title.trim() || !content.trim() || selectedTags.length === 0 || createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </SheButton>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{content.length}/{MAX_POST_LENGTH} characters</p>
      {createPostMutation.isError && (
        <p className="text-xs text-destructive mt-2">Could not publish your post. Please try again.</p>
      )}
    </SheCard>
  );
}

export function PostsFeed() {
  const { user } = useAuth();
  const { data: posts, isLoading, isError } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const queryClient = useQueryClient();
  const [likedPostIds, setLikedPostIds] = useState<Record<string, true>>({});
  const [commentDraftByPost, setCommentDraftByPost] = useState<Record<string, string>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, string[]>>({});

  const likedPostsStorageKey = user ? `shecare-liked-posts:${user.id}` : null;

  useEffect(() => {
    if (!likedPostsStorageKey) {
      setLikedPostIds({});
      return;
    }

    try {
      const stored = localStorage.getItem(likedPostsStorageKey);
      if (!stored) {
        setLikedPostIds({});
        return;
      }

      const parsed = JSON.parse(stored) as unknown;
      if (!Array.isArray(parsed)) {
        setLikedPostIds({});
        return;
      }

      const map = parsed.reduce<Record<string, true>>((acc, postId) => {
        if (typeof postId === "string" && postId.trim()) {
          acc[postId] = true;
        }
        return acc;
      }, {});

      setLikedPostIds(map);
    } catch {
      setLikedPostIds({});
    }
  }, [likedPostsStorageKey]);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, comment }: { postId: string; comment: string }) => commentOnPost(postId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const getPostKey = (postId: string | undefined, authorId: string, createdAt: string, index: number) => (
    postId || `${authorId}-${createdAt}-${index}`
  );


  const handleLike = async (postId: string | undefined) => {
    if (!postId) {
      return;
    }

    if (likedPostIds[postId]) {
      toast.info("You can only like a post once.");
      return;
    }

    try {
      await likeMutation.mutateAsync(postId);
      setLikedPostIds((prev) => {
        const next = { ...prev, [postId]: true as const };
        if (likedPostsStorageKey) {
          localStorage.setItem(likedPostsStorageKey, JSON.stringify(Object.keys(next)));
        }
        return next;
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not persist like."));
    }
  };

  const handleShare = async (postId: string | undefined) => {
    if (!postId) {
      return;
    }

    try {
      await shareMutation.mutateAsync(postId);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not persist share."));
    }
  };

  const addComment = async (postId: string | undefined, postKey: string) => {
    const draft = commentDraftByPost[postKey]?.trim();
    if (!draft) {
      return;
    }

    setCommentsByPost((prev) => ({
      ...prev,
      [postKey]: [...(prev[postKey] || []), draft],
    }));

    setCommentDraftByPost((prev) => ({
      ...prev,
      [postKey]: "",
    }));

    if (!postId) {
      return;
    }

    try {
      await commentMutation.mutateAsync({ postId, comment: draft });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not persist comment."));
    }
  };

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
      {posts.map((post, postIndex) => (
        <SheCard key={getPostKey(post.post_id, post.author_id, post.createdAt, postIndex)}>
          {(() => {
            const postKey = getPostKey(post.post_id, post.author_id, post.createdAt, postIndex);
            const isLikedByCurrentUser = Boolean(post.post_id && likedPostIds[post.post_id]);
            const commentDraft = commentDraftByPost[postKey] || "";
            const postComments = commentsByPost[postKey] || [];

            return (
              <>
          <div className="flex items-start gap-3 mb-3">
          
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{post.authorName}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
              </div>
              <div className="flex gap-1.5 mt-1">
                {post.tags.map((tag, tagIndex) => (
                  <span key={`${postKey}-${tag}-${tagIndex}`} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColors[tag] || "bg-muted text-muted-foreground"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {post.title && <h3 className="text-sm font-semibold text-foreground mb-2">{post.title}</h3>}
          <p className="text-sm text-foreground leading-relaxed mb-4">{post.content}</p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <button
              className={`flex items-center gap-1.5 text-xs transition-colors ${isLikedByCurrentUser ? "text-primary" : "hover:text-primary"}`}
              onClick={() => void handleLike(post.post_id)}
              disabled={isLikedByCurrentUser || likeMutation.isPending || !post.post_id}
              type="button"
            >
              <FiHeart className="w-4 h-4" /> {post.likes}
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-shecare-blue transition-colors" type="button">
              <FiMessageCircle className="w-4 h-4" /> {post.comments}
            </button>
            <button
              className="flex items-center gap-1.5 text-xs hover:text-shecare-green transition-colors"
              onClick={() => void handleShare(post.post_id)}
              type="button"
            >
              <FiShare2 className="w-4 h-4" /> {post.shares}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <SheInput
              placeholder="Write a comment..."
              value={commentDraft}
              onChange={(e) => setCommentDraftByPost((prev) => ({ ...prev, [postKey]: e.target.value }))}
            />
            <SheButton size="sm" variant="outline" onClick={() => void addComment(post.post_id, postKey)} disabled={!commentDraft.trim()} type="button">
              Comment
            </SheButton>
          </div>
          {postComments.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {postComments.map((comment, commentIndex) => (
                <p key={`${postKey}-comment-${commentIndex}`} className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">
                  {comment}
                </p>
              ))}
            </div>
          )}
              </>
            );
          })()}
        </SheCard>
      ))}
    </div>
  );
}
