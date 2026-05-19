"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Loader2,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  Home
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProjectsViewProps {
  initialCategories: Category[];
  initialProjects: {
    data: any[];
    meta: any;
  };
}

export default function ProjectsView({ initialCategories, initialProjects }: ProjectsViewProps) {
  const t = useTranslations("projects");
  const common = useTranslations("common");
  const ct = useTranslations("categories");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "created_at");
  const [order, setOrder] = useState<string>(searchParams.get("order") || "desc");
  const [page, setPage] = useState<number>(() => Number(searchParams.get("page")) || 1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Debounce search
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, isMounted]);

  // Update URL
  useEffect(() => {
    if (!isMounted) return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (category !== "all") params.append("category", category);
    if (sortBy) params.append("sort", sortBy);
    if (order) params.append("order", order);
    if (page > 1) params.append("page", page.toString());

    const queryString = params.toString();
    const url = queryString ? `/projects?${queryString}` : "/projects";
    router.replace(url, { scroll: false });
  }, [debouncedSearch, category, sortBy, order, page, isMounted, router]);

  // Sync page from URL params if changed externally (e.g. back navigation)
  useEffect(() => {
    const pg = Number(searchParams.get("page")) || 1;
    if (pg !== page) setPage(pg);
  }, [searchParams]);

  // Query projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects", debouncedSearch, category, sortBy, order, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (category !== "all") params.append("category", category);
      if (sortBy) params.append("sort", sortBy);
      if (order) params.append("order", order);
      params.append("page", page.toString());
      params.append("per_page", "12");

      const response = await apiClient.get(`/portfolios?${params.toString()}`);
      return response.data;
    },
    enabled: isMounted,
  });

  const currentProjectsData = (!isMounted || (isLoading && !projectsData)) ? initialProjects : projectsData;
  const projects = currentProjectsData?.data || [];
  const meta = currentProjectsData?.meta;

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  const handleFilterChange = (updater: () => void) => {
    updater();
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">{common("handyman_category")}</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant={category === "all" ? "secondary" : "ghost"}
            className="justify-start rounded-xl font-medium"
            onClick={() => handleFilterChange(() => setCategory("all"))}
          >
            {ct("all")}
          </Button>
          {initialCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.slug ? "secondary" : "ghost"}
              className="justify-start rounded-xl font-medium text-muted-foreground hover:text-primary"
              onClick={() => handleFilterChange(() => setCategory(cat.slug))}
            >
              {ct(cat.slug)}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full rounded-xl h-12 border-primary/20 text-primary hover:bg-primary/5"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 md:px-16 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium">
            {t("title")}
          </span>
        </nav>
      </div>

      <div className="container mx-auto px-6 md:px-16 pt-10 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-base">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-11 rounded-full border-border bg-white h-12 shadow-sm focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger render={
                  <Button variant="outline" className="rounded-full h-12 border-border bg-white px-6 gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                } />
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto px-8 pt-10 pb-10">
                  <SheetHeader className="mb-8 text-left">
                    <SheetTitle className="text-2xl font-heading">{common("filter")}</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32">
              <FilterSidebar />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            {/* Sorting Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm font-medium text-muted-foreground">
                Showing <span className="text-primary font-bold">{projects.length}</span> projects
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Sort By:</span>
                <Select
                  value={`${sortBy}-${order}`}
                  onValueChange={(val) => {
                    if (!val) return;
                    const [s, o] = val.split("-");
                    handleFilterChange(() => {
                      setSortBy(s);
                      setOrder(o);
                    });
                  }}
                >
                  <SelectTrigger className="w-48 rounded-xl border-border bg-white h-10 text-sm">
                    <SelectValue>
                      {(() => {
                        const options: Record<string, string> = {
                          "created_at-desc": "Newest First",
                          "created_at-asc": "Oldest First",
                          "title-asc": "Title A-Z",
                        };
                        return options[`${sortBy}-${order}`] || "Newest First";
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
                <p className="text-muted-foreground font-medium italic">Curating best projects for you...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-8">
                {projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-dashed border-border py-24 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">No projects found</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  We couldn't find any projects matching your current filters. Try adjusting your search or resetting the filters.
                </p>
                <Button variant="secondary" className="rounded-full px-8" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-border"
                    disabled={meta.current_page === 1}
                    onClick={() => {
                      setPage(meta.current_page - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Previous
                  </Button>
                  <div className="px-4 text-sm font-medium">
                    Page {meta.current_page} of {meta.last_page}
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border"
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => {
                      setPage(meta.current_page + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
