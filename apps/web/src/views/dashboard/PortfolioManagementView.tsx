"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePortfolios, useDeletePortfolio, Portfolio } from "@/hooks/usePortfolios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Images, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import PortfolioProjectCard from "@/components/dashboard/portfolio/PortfolioProjectCard";
import CreateProjectModal from "@/components/dashboard/portfolio/CreateProjectModal";
import ProjectDetailsModal from "@/components/dashboard/portfolio/ProjectDetailsModal";
import { Button } from "@/components/ui/button";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function PortfolioManagementView() {
  const t = useTranslations("dashboard");
  const pt = useTranslations("dashboard.portfolio");
  const { data: portfolios, isLoading } = usePortfolios();
  const deletePortfolio = useDeletePortfolio();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const selectedPortfolio = portfolios?.find(p => p.id === selectedPortfolioId) || null;

  const handleViewDetails = (portfolio: Portfolio) => {
    setSelectedPortfolioId(portfolio.id);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deletePortfolio.mutate(deleteTargetId, {
        onSettled: () => {
          setIsDeleteConfirmOpen(false);
          setDeleteTargetId(null);
        }
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            {t("portfolios")}
          </h1>
          <p className="text-muted-foreground">{pt("portfolioSubtitle")}</p>
        </div>
        <PermissionGuard role="handyman">
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="rounded-2xl h-12 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold shadow-lg shadow-secondary/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            {pt("createProject")}
          </Button>
        </PermissionGuard>
      </div>

      <PermissionGuard role="handyman">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading your work...</p>
          </div>
        ) : portfolios && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioProjectCard
                key={portfolio.id}
                portfolio={portfolio}
                onView={handleViewDetails}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-6 rounded-3xl border-2 border-dashed border-border bg-white flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Images className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">{pt("noProjects")}</h3>
            <p className="text-muted-foreground mb-8">
              {pt("noProjects")} Showcase your best repairs and renovations to stand out.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl h-11 px-8 border-primary text-primary hover:bg-primary/5 font-bold"
            >
              {pt("createProject")}
            </Button>
          </div>
        )}
      </PermissionGuard>

      <CreateProjectModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />

      <ProjectDetailsModal
        portfolio={selectedPortfolio}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-heading font-bold">
              {pt("deleteProject")}?
            </DialogTitle>
            <DialogDescription className="mt-2">
              This action cannot be undone. This will permanently delete the project and all its images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-xl flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePortfolio.isPending}
              className="rounded-xl flex-1 shadow-lg shadow-destructive/20"
            >
              {deletePortfolio.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
