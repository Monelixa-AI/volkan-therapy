"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type MediaAsset = {
  id: string;
  url: string;
  type: string;
  title?: string | null;
  altText?: string | null;
  size?: number | null;
  createdAt: string;
};

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (error) {
      toast.error("Medya listesi yuklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>("input[name='file']");
    if (!fileInput?.files?.length) {
      toast.error("Lutfen dosya secin.");
      return;
    }

    const formData = new FormData(form);
    setIsUploading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Yukleme basarisiz");
      }
      toast.success("Dosya yuklendi.");
      form.reset();
      await loadAssets();
    } catch (error: any) {
      toast.error(error.message || "Yukleme hatasi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Kopyalandi.");
    } catch (error) {
      toast.error("Kopyalanamadi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginizden emin misiniz?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Silme hatasi");
      }
      toast.success("Silindi.");
      await loadAssets();
    } catch (error: any) {
      toast.error(error.message || "Silme hatasi.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Medya Kutuphanesi</h1>
        <p className="text-sm text-slate-500">Gorsel ve videolari yukleyin.</p>
      </div>

      <form
        onSubmit={handleUpload}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Dosya</span>
            <input
              type="file"
              name="file"
              className="w-full text-sm"
              accept="image/*,video/*"
            />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Tip</span>
            <select name="type" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="IMAGE">Gorsel</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Dokuman</option>
            </select>
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Baslik</span>
            <input name="title" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm block">
            <span className="block text-slate-600 mb-1">Alt Metin</span>
            <input name="altText" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Yukleniyor..." : "Dosya Yukle"}
        </Button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Medya Listesi</h2>
          {isLoading && <span className="text-xs text-slate-400">Yukleniyor...</span>}
        </div>
        <div className="divide-y divide-slate-200">
          {assets.map((asset) => (
            <div key={asset.id} className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-4">
              <div className="h-20 w-28 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-xs text-slate-400">
                {asset.type === "IMAGE" ? (
                  <img src={asset.url} alt={asset.altText || asset.title || ""} className="h-full w-full object-cover" />
                ) : (
                  <span>{asset.type}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{asset.title || asset.url}</p>
                <p className="text-xs text-slate-500">{asset.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(asset.url)}>
                  Kopyala
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
                  Sil
                </Button>
              </div>
            </div>
          ))}
          {assets.length === 0 && !isLoading && (
            <div className="px-6 py-10 text-sm text-slate-500">
              Medya bulunamadi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
