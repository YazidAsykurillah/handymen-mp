"use client";

import { Portfolio } from "@/hooks/usePortfolios";
import { Card, CardContent } from "@/components/ui/card";
import { Images, MoreVertical, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortfolioProjectCardProps {
  portfolio: Portfolio;
  onView: (portfolio: Portfolio) => void;
  onDelete: (id: number) => void;
}

export default function PortfolioProjectCard({
  portfolio,
  onView,
  onDelete,
}: PortfolioProjectCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/40 hover:shadow-lg transition-all duration-300 p-0">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {portfolio.thumbnail ? (
          <img
            src={portfolio.thumbnail.image_url}
            alt={portfolio.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Images className="w-10 h-10 opacity-20" />
            <span className="text-xs font-medium">No images</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full"
            onClick={() => onView(portfolio)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-none shadow-sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => onDelete(portfolio.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-lg line-clamp-1">{portfolio.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {portfolio.description || "No description provided"}
        </p>
        <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 w-fit px-2 py-1 rounded-lg">
          <Images className="w-3 h-3" />
          {portfolio.images.length} Images
        </div>
      </CardContent>
    </Card>
  );
}
