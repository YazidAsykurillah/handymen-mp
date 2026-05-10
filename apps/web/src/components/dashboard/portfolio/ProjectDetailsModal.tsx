"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Portfolio, useAddPortfolioImages, useSetThumbnail, useDeletePortfolioImage } from "@/hooks/usePortfolios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Star, CheckCircle2, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useUpdatePortfolio } from "@/hooks/usePortfolios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProjectDetailsModalProps {
  portfolio: Portfolio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDetailsModal({
  portfolio,
  open,
  onOpenChange,
}: ProjectDetailsModalProps) {
  const t = useTranslations("dashboard.portfolio");
  const addImages = useAddPortfolioImages(portfolio?.id || 0);
  const setThumbnail = useSetThumbnail();
  const deleteImage = useDeletePortfolioImage();
  const updatePortfolio = useUpdatePortfolio(portfolio?.id || 0);

  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Sync state when portfolio changes
  useEffect(() => {
    if (portfolio) {
      setEditTitle(portfolio.title);
      setEditDescription(portfolio.description || "");
    }
  }, [portfolio]);

  if (!portfolio) return null;

  const handleSave = () => {
    updatePortfolio.mutate({
      title: editTitle,
      description: editDescription,
    }, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (portfolio.images.length + selectedFiles.length > 8) {
      toast.error(t("maxImages"));
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    setIsUploading(true);
    addImages.mutate(formData, {
      onSettled: () => setIsUploading(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setIsEditing(false);
    }}>
      <DialogContent className="sm:max-w-[700px] rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              {isEditing ? (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-xs">{t("projectTitle")}</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-desc" className="text-xs">{t("projectDescription")}</Label>
                    <Textarea
                      id="edit-desc"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="rounded-xl min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updatePortfolio.isPending}
                      className="rounded-lg h-9 px-4 bg-primary text-primary-foreground"
                    >
                      {updatePortfolio.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {t("update").replace("!", "")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(portfolio.title);
                        setEditDescription(portfolio.description || "");
                      }}
                      className="rounded-lg h-9"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t("cancel", { defaultValue: "Cancel" })}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <DialogTitle className="text-2xl font-heading font-bold text-primary">
                    {portfolio.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    {portfolio.description || "No description provided"}
                  </DialogDescription>
                </>
              )}
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setEditTitle(portfolio.title);
                  setEditDescription(portfolio.description || "");
                  setIsEditing(true);
                }}
                className="rounded-xl h-10 w-10 flex-shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg">{t("images")}</h3>
            <span className="text-xs text-muted-foreground">
              {portfolio.images.length} / 8 {t("images")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolio.images.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-2xl bg-muted overflow-hidden border border-border/40">
                <img
                  src={img.image_url}
                  className="w-full h-full object-cover"
                  alt="Portfolio"
                />

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
                  {!img.is_thumbnail && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 w-full text-[10px] rounded-lg"
                      onClick={() => setThumbnail.mutate(img.id)}
                      disabled={setThumbnail.isPending}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Make Thumbnail
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-full text-[10px] rounded-lg"
                    onClick={() => deleteImage.mutate(img.id)}
                    disabled={deleteImage.isPending}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Badge if thumbnail */}
                {img.is_thumbnail && (
                  <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Thumbnail
                  </div>
                )}
              </div>
            ))}

            {portfolio.images.length < 8 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <>
                    <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                    <span className="text-xs font-medium text-muted-foreground">{t("addMoreImages")}</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImages}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} variant="secondary" className="rounded-xl px-8">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
