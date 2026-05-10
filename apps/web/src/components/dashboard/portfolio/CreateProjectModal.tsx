"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCreatePortfolio } from "@/hooks/usePortfolios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const t = useTranslations("dashboard.portfolio");
  const createPortfolio = useCreatePortfolio();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 8) {
      toast.error(t("maxImages"));
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("images[]", file);
    });

    createPortfolio.mutate(formData, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setFiles([]);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-primary">
            {t("createProject")}
          </DialogTitle>
          <DialogDescription>{t("portfolioSubtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("projectTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              required
              className="rounded-xl border-border h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("projectDescription")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder={t("descPlaceholder")}
              className="rounded-xl border-border min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>{t("images")}</Label>
            <div className="grid grid-cols-4 gap-2">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-xl bg-muted overflow-hidden border border-border/40">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {files.length < 8 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-medium text-muted-foreground">Add</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{t("maxImages")}</p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPortfolio.isPending}
              className="rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8"
            >
              {createPortfolio.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {t("createProject")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
