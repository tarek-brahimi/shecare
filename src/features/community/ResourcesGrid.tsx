import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/services/api";
import { SheCard } from "@/ui/Card";
import { SheInput } from "@/ui/Input";
import { SheButton } from "@/ui/Button";
import { FiSearch, FiBookOpen, FiPlayCircle, FiDownload, FiStar } from "react-icons/fi";
import type { Resource } from "@/types/domain";

const categoryIcons: Record<string, React.ElementType> = {
  guide: FiBookOpen,
  video: FiPlayCircle,
  pdf: FiDownload,
};

const categoryColors: Record<string, string> = {
  guide: "bg-shecare-blue-light text-shecare-blue",
  video: "bg-shecare-purple-light text-shecare-purple",
  pdf: "bg-shecare-green-light text-shecare-green",
};

const categoryLabels: Record<string, string> = {
  guide: "Treatment Guide",
  video: "Video",
  pdf: "PDF",
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = categoryIcons[resource.category] || FiBookOpen;
  const color = categoryColors[resource.category] || "bg-muted text-muted-foreground";

  return (
    <SheCard className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {resource.featured && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-shecare-orange bg-shecare-orange-light px-2 py-0.5 rounded-full">
            <FiStar className="w-3 h-3" /> Featured
          </span>
        )}
      </div>
      <span className={`text-[10px] font-medium uppercase tracking-wide ${color.split(" ")[1]} mb-2`}>
        {categoryLabels[resource.category]}
      </span>
      <h3 className="font-semibold text-foreground text-sm mb-1.5">{resource.title}</h3>
      <p className="text-xs text-muted-foreground flex-1">{resource.description}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">{resource.author}</span>
        {resource.duration && <span className="text-xs text-muted-foreground">{resource.duration}</span>}
      </div>
    </SheCard>
  );
}

export function ResourcesGrid() {
  const { data: resources, isLoading, isError } = useQuery({ queryKey: ["resources"], queryFn: getResources });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const resourcesList = (Array.isArray(resources) ? resources : []).map((resource, index): Resource => {
    const raw = (resource ?? {}) as Partial<Resource>;
    const category = raw.category === "guide" || raw.category === "video" || raw.category === "pdf"
      ? raw.category
      : "guide";

    return {
      id: typeof raw.id === "string" && raw.id.trim() ? raw.id : `resource-${index}`,
      title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Untitled resource",
      description: typeof raw.description === "string" ? raw.description : "",
      category,
      featured: Boolean(raw.featured),
      imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : undefined,
      duration: typeof raw.duration === "string" ? raw.duration : undefined,
      author: typeof raw.author === "string" && raw.author.trim() ? raw.author : "SheCare",
    };
  });

  const filtered = resourcesList.filter((r) => {
    const searchText = search.trim().toLowerCase();
    const matchSearch = !searchText
      || r.title.toLowerCase().includes(searchText)
      || r.description.toLowerCase().includes(searchText);
    const matchCategory = category === "all" || r.category === category;
    return matchSearch && matchCategory;
  });

  const featured = filtered?.filter((r) => r.featured);

  const categories = [
    { value: "all", label: "All" },
    { value: "guide", label: "Guides" },
    { value: "video", label: "Videos" },
    { value: "pdf", label: "PDFs" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <SheInput
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <SheButton
              key={c.value}
              variant={category === c.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </SheButton>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SheCard key={i} className="animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-xl mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full mb-1" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </SheCard>
          ))}
        </div>
      ) : isError ? (
        <SheCard className="text-center py-12">
          <p className="text-destructive">Could not load resources right now.</p>
        </SheCard>
      ) : (
        <>
          {featured && featured.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Featured Resources</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">All Resources</h3>
            {filtered?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            ) : (
              <SheCard className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your search.</p>
              </SheCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}
