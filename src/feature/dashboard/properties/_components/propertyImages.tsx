"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useAddImagePropertyMutation, useDeleteImagePropertyMutation } from "@/store/slices/propertySlice";
import type { LocalizedProperty } from "@/types/property";

function PropertyImages({ property }: { property: LocalizedProperty }) {
    const t = useTranslations("PropertyActions");
    const [addImages, { isLoading: uploading }] = useAddImagePropertyMutation();
    const [deleteImage] = useDeleteImagePropertyMutation();
    const [files, setFiles] = useState<File[]>([]);
    const [inputKey, setInputKey] = useState(0);
    const [deleting, setDeleting] = useState<string | null>(null);

    async function handleUpload(e: FormEvent) {
        e.preventDefault();
        if (!files.length) return;
        const body = new FormData();
        files.forEach((f) => body.append("images", f));
        try {
            await addImages({ id: property._id, body }).unwrap();
            toast.success(t("imagesAdded"));
            setFiles([]);
            setInputKey((k) => k + 1);
        } catch (err) {
            toast.error(parseApiError(err, t("imagesFailed")).message);
        }
    }

    async function handleDelete(publicId: string) {
        if (!window.confirm(t("imageDeleteConfirm"))) return;
        setDeleting(publicId);
        try {
            await deleteImage({ id: property._id, body: { publicId } }).unwrap();
            toast.success(t("imageDeleted"));
        } catch (err) {
            toast.error(parseApiError(err, t("imagesFailed")).message);
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {property.images.length === 0 ? (
                <p className="text-muted-foreground">{t("noImages")}</p>
            ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {property.images.map((img) => (
                        <li key={img.publicId} className="relative overflow-hidden rounded-lg border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="aspect-4/3 w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleDelete(img.publicId)}
                                disabled={deleting === img.publicId}
                                className="absolute inset-e-2 top-2 cursor-pointer rounded-md bg-destructive px-2 py-1 text-xs text-destructive-foreground disabled:opacity-50"
                            >
                                {t("delete")}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleUpload} className="flex flex-col gap-3 border-t border-border pt-4">
                <input
                    key={inputKey}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                    className="text-sm file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground"
                />
                <div className="flex justify-end">
                    <Button type="submit" loading={uploading} disabled={!files.length}>{t("upload")}</Button>
                </div>
            </form>
        </div>
    );
}

export default PropertyImages;