"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Image, Video, FolderOpen, Upload, HardDrive } from "lucide-react";

type MediaAsset = {
  id: string;
  url: string;
  type: string;
  title?: string | null;
  altText?: string | null;
  size?: number | null;
  createdAt: string;
};

type SystemFile = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video";
  size: number;
  folder: string;
};

type SystemFilesResponse = {
  files: SystemFile[];
  folders: string[];
  stats: {
    totalImages: number;
    totalVideos: number;
    totalSize: number;
  };
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function AdminMediaPage() {
  const [activeTab, setActiveTab] = useState<"uploaded" | "system">("system");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [systemFiles, setSystemFiles] = useState<SystemFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (error) {
      toast.error("Medya listesi yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media/files");
      const data: SystemFilesResponse = await res.json();
      setSystemFiles(data.files || []);
      setFolders(data.folders || []);
    } catch (error) {
      toast.error("Sistem dosyaları yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "uploaded") {
      loadAssets();
    } else {
      loadSystemFiles();
    }
  }, [activeTab]);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>("input[name='file']");
    if (!fileInput?.files?.length) {
      toast.error("Lütfen dosya seçin.");
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
        throw new Error(data.error || "Yükleme başarısız");
      }
      toast.success("Dosya yüklendi.");
      form.reset();
      await loadAssets();
    } catch (error: any) {
      toast.error(error.message || "Yükleme hatası.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL kopyalandı.");
    } catch (error) {
      toast.error("Kopyalanamadı.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Silme hatası");
      }
      toast.success("Silindi.");
      await loadAssets();
    } catch (error: any) {
      toast.error(error.message || "Silme hatası.");
    }
  };

  const filteredSystemFiles = systemFiles.filter((file) => {
    if (selectedFolder !== "all" && file.folder !== selectedFolder) return false;
    if (filterType !== "all" && file.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Medya Kütüphanesi</h1>
        <p className="text-sm text-slate-500">Görsel ve videoları görüntüleyin ve yönetin.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "system"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Sistem Dosyaları
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("uploaded")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "uploaded"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Upload className="w-4 h-4" />
          Yüklenen Medya
        </button>
      </div>

      {activeTab === "uploaded" && (
        <>
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
                  <option value="IMAGE">Görsel</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Doküman</option>
                </select>
              </label>
              <label className="text-sm block">
                <span className="block text-slate-600 mb-1">Başlık</span>
                <input name="title" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <label className="text-sm block">
                <span className="block text-slate-600 mb-1">Alt Metin</span>
                <input name="altText" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
            </div>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Yükleniyor..." : "Dosya Yükle"}
            </Button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Yüklenen Dosyalar</h2>
              {isLoading && <span className="text-xs text-slate-400">Yükleniyor...</span>}
            </div>
            <div className="divide-y divide-slate-200">
              {assets.map((asset) => (
                <div key={asset.id} className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-4">
                  <div className="h-20 w-28 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-xs text-slate-400">
                    {asset.type === "IMAGE" ? (
                      <img src={asset.url} alt={asset.altText || asset.title || ""} className="h-full w-full object-cover" />
                    ) : asset.type === "VIDEO" ? (
                      <Video className="w-8 h-8 text-slate-400" />
                    ) : (
                      <span>{asset.type}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{asset.title || asset.url}</p>
                    <p className="text-xs text-slate-500 truncate">{asset.url}</p>
                    {asset.size && <p className="text-xs text-slate-400">{formatSize(asset.size)}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(asset.url)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Kopyala
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
              {assets.length === 0 && !isLoading && (
                <div className="px-6 py-10 text-sm text-slate-500 text-center">
                  Henüz yüklenmiş medya bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "system" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">Tüm Klasörler</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">Tüm Tipler</option>
              <option value="image">Görseller</option>
              <option value="video">Videolar</option>
            </select>
            <span className="text-sm text-slate-500 flex items-center">
              {filteredSystemFiles.length} dosya bulundu
            </span>
          </div>

          {/* Grid View */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            {isLoading ? (
              <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
            ) : filteredSystemFiles.length === 0 ? (
              <div className="text-center py-10 text-slate-500">Dosya bulunamadı.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredSystemFiles.map((file) => (
                  <div
                    key={file.url}
                    className="group relative rounded-xl border border-slate-200 overflow-hidden hover:border-primary-400 transition-colors"
                  >
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <Video className="w-8 h-8" />
                          <span className="text-xs">Video</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-slate-700 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
                        <div className="flex items-center gap-1">
                          {file.type === "image" ? (
                            <Image className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Video className="w-3 h-3 text-purple-500" />
                          )}
                          <FolderOpen className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>
                    {/* Hover overlay with copy button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCopy(file.url)}
                        className="bg-white text-slate-900 hover:bg-slate-100"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        URL Kopyala
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Bu dosyalar <code className="bg-slate-100 px-1 rounded">public/images</code> ve{" "}
            <code className="bg-slate-100 px-1 rounded">public/videos</code> klasörlerinden otomatik olarak listelenmektedir.
            İçerik düzenleyicide kullanmak için URL&apos;yi kopyalayın.
          </p>
        </div>
      )}
    </div>
  );
}
