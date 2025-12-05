"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Image } from "lucide-react";
import * as React from "react";

type UploadImagesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sku: string | null;
};

export default function UploadImagesModal({
  open,
  onOpenChange,
  sku,
}: UploadImagesModalProps) {
  const [error, setError] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [existingImages, setExistingImages] = React.useState<any[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(false);
  const [productName, setProductName] = React.useState("");

  const maxImages = 4;

  const loadProductImages = async () => {
    if (!sku) return;

    try {
      setLoadingImages(true);
      setError("");

      const res = await fetch(`/response/api/product/public/${sku}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar imagens do produto");
      }

      const json = await res.json();

      const images = json?.data?.images ?? [];
      const name = json?.data?.name || json?.data?.product_name || "Produto";
      
      setExistingImages(images);
      setProductName(name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSubmit = async () => {
    if (!sku) {
      setError("Produto não identificado");
      return;
    }

    if (files.length === 0) {
      setError("Selecione pelo menos uma imagem");
      return;
    }

    const totalImages = existingImages.length + files.length;
    if (totalImages > maxImages) {
      setError(`Total de imagens não pode exceder ${maxImages}. Atualmente: ${existingImages.length}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const res = await fetch(`/response/api/product/${sku}/images`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar imagens");
      }

      setFiles([]);
      await loadProductImages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractName = (public_id: string) => {
    return public_id.split("/").pop();
  };

  React.useEffect(() => {
    if (open) {
      loadProductImages();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <Image className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span>Imagens do Produto</span>
              {productName && (
                <span className="text-sm font-normal text-gray-500 mt-0.5">
                  {productName}
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* IMAGENS ATUAIS */}
          {loadingImages ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p className="text-sm text-gray-500">Carregando imagens...</p>
              </div>
            </div>
          ) : existingImages.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Imagens atuais</Label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {existingImages.length} / {maxImages}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {existingImages.map((img) => (
                  <div
                    key={img.public_id}
                    className={`group relative border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                      img.is_primary
                        ? "border-red-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="aspect-square bg-gray-50">
                      <img
                        src={img.url}
                        alt={extractName(img.public_id)}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>

                    <div className="p-2 bg-white">
                      <span className="block truncate text-xs font-medium text-gray-700">
                        {extractName(img.public_id)}
                      </span>
                    </div>

                    {img.is_primary && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                          PRINCIPAL
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Alert className="border-dashed border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Este produto ainda não possui imagens cadastradas.
              </AlertDescription>
            </Alert>
          )}

          {/* UPLOAD NOVAS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Adicionar novas imagens</Label>
              <span className="text-xs text-gray-500">
                Máx. {maxImages} imagens
              </span>
            </div>

            <div className="relative">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para selecionar</span> ou arraste aqui
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG ou WEBP</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    setError("");
                    const selected = Array.from(e.target.files ?? []);
                    if (selected.length > maxImages) {
                      setError(`Máximo de ${maxImages} imagens`);
                      return;
                    }
                    setFiles(selected);
                  }}
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  {files.length} arquivo(s) selecionado(s)
                </Label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded border border-gray-200"
                    >
                      <Image className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-gray-700">{f.name}</span>
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                        {(f.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Fechar
          </Button>

          <Button
            disabled={loading || files.length === 0}
            onClick={handleSubmit}
            className="px-6 bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Enviando...
              </span>
            ) : (
              "Salvar Imagens"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}