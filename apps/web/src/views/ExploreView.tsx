"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  SlidersHorizontal,
  Loader2,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { HandymanCard } from "@/components/handyman/HandymanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Handyman {
  id: number;
  name: string;
  slug: string;
  photo_profile: string;
  rating_avg: string;
  review_count: number;
  is_verified: boolean;
  is_premium: boolean;
  city?: { name: string };
  categories?: Category[];
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  province_id: number;
}

interface ExploreViewProps {
  initialCategories: Category[];
  initialHandymen: {
    data: Handyman[];
    meta: any;
  };
  initialProvinces: Province[];
}

export default function ExploreView({ initialCategories, initialHandymen, initialProvinces }: ExploreViewProps) {
  const t = useTranslations("common");
  const h = useTranslations("handyman");
  
  // Filter States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<string>("desc");
  const [isVerified, setIsVerified] = useState<string>("all");
  const [isPremium, setIsPremium] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("all");
  const [provinceId, setProvinceId] = useState<string>("all");
  const [cityId, setCityId] = useState<string>("all");

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Query for Handymen
  const { data: handymenData, isLoading, isFetching } = useQuery({
    queryKey: ["handymen", debouncedSearch, category, sortBy, order, isVerified, isPremium, minRating, provinceId, cityId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (category !== "all") params.append("category", category);
      if (sortBy) params.append("sort", sortBy);
      if (order) params.append("order", order);
      if (isVerified !== "all") params.append("is_verified", isVerified === "yes" ? "1" : "0");
      if (isPremium !== "all") params.append("is_premium", isPremium === "yes" ? "1" : "0");
      if (minRating !== "all") params.append("rating_min", minRating);
      if (provinceId !== "all") params.append("province_id", provinceId);
      if (cityId !== "all") params.append("city_id", cityId);
      params.append("per_page", "12");
      
      const response = await apiClient.get(`/handymen?${params.toString()}`);
      return response.data;
    },
  });

  // Use initial data only during hydration
  const currentHandymenData = (!isMounted || (isLoading && !handymenData)) ? initialHandymen : handymenData;
  const handymen = currentHandymenData?.data || [];
  const meta = currentHandymenData?.meta;

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setIsVerified("all");
    setIsPremium("all");
    setMinRating("all");
    setProvinceId("all");
    setCityId("all");
  };

  // Query for Cities based on Province
  const { data: citiesData } = useQuery({
    queryKey: ["cities", provinceId],
    queryFn: async () => {
      if (provinceId === "all") return [];
      const response = await apiClient.get(`/cities?province_id=${provinceId}`);
      return response.data.data as City[];
    },
    enabled: provinceId !== "all",
  });
  const cities = citiesData || [];

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Location</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Province</label>
            <Select value={provinceId} onValueChange={(val) => {
              setProvinceId(val || "all");
              setCityId("all");
            }}>
              <SelectTrigger className="w-full rounded-xl border-border bg-white h-12">
                <SelectValue>
                  {provinceId === "all" ? "All Provinces" : initialProvinces.find(p => p.id.toString() === provinceId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {initialProvinces.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">City</label>
            <Select 
              value={cityId} 
              onValueChange={(val) => setCityId(val || "all")}
              disabled={provinceId === "all"}
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-white h-12">
                <SelectValue>
                  {provinceId === "all" 
                    ? "Select Province first" 
                    : (cityId === "all" ? "All Cities" : cities.find(c => c.id.toString() === cityId)?.name)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
        <div className="flex flex-col gap-2">
          <Button 
            variant={category === "all" ? "secondary" : "ghost"} 
            className="justify-start rounded-xl font-medium"
            onClick={() => setCategory("all")}
          >
            All Categories
          </Button>
          {initialCategories.map((cat) => (
            <Button 
              key={cat.id}
              variant={category === cat.slug ? "secondary" : "ghost"} 
              className="justify-start rounded-xl font-medium text-muted-foreground hover:text-primary"
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Professional Status</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Verified Only</label>
            <Select value={isVerified} onValueChange={(val) => setIsVerified(val || "all")}>
              <SelectTrigger className="w-full rounded-xl border-border bg-white h-12">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professionals</SelectItem>
                <SelectItem value="yes">Verified Only</SelectItem>
                <SelectItem value="no">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Premium Status</label>
            <Select value={isPremium} onValueChange={(val) => setIsPremium(val || "all")}>
              <SelectTrigger className="w-full rounded-xl border-border bg-white h-12">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="yes">Premium Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Minimum Rating</h3>
        <Select value={minRating} onValueChange={(val) => setMinRating(val || "all")}>
          <SelectTrigger className="w-full rounded-xl border-border bg-white h-12">
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Rating</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="4.0">4.0+ Stars</SelectItem>
            <SelectItem value="3.5">3.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
      <div className="container mx-auto px-6 md:px-16 pt-12 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tight mb-4">
              Explore Professionals
            </h1>
            <p className="text-muted-foreground text-lg">
              Find and compare top-rated handymen for your project. Meticulously vetted, consistently rated.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name..."
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
                <SheetContent side="left" className="w-[300px] overflow-y-auto pt-10">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-heading">Filters</SheetTitle>
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
                Showing <span className="text-primary font-bold">{handymen.length}</span> professionals
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select value={`${sortBy}-${order}`} onValueChange={(val) => {
                  if (!val) return;
                  const [s, o] = val.split("-");
                  setSortBy(s);
                  setOrder(o);
                }}>
                  <SelectTrigger className="w-48 rounded-xl border-border bg-white h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="rating_avg-desc">Highest Rated</SelectItem>
                    <SelectItem value="review_count-desc">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
                <p className="text-muted-foreground font-medium italic">Finding experts for you...</p>
              </div>
            ) : handymen.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {handymen.map((h: Handyman) => (
                  <HandymanCard key={h.id} handyman={h} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-dashed border-border py-24 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">No professionals found</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  We couldn't find any professionals matching your current filters. Try adjusting your search or resetting the filters.
                </p>
                <Button variant="secondary" className="rounded-full px-8" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {meta && meta.last_page > 1 && (
              <div className="mt-16 flex justify-center">
                {/* We can implement pagination components here later */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-border"
                    disabled={meta.current_page === 1}
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
