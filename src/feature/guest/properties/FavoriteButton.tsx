"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/navigation";
import { cookieHelper } from "@/lib/cookies";
import { parseApiError } from "@/lib/apiError";
import { useAddToFavoriteMutation, useListFavoriteQuery, useDaleteFavoritMutation } from "@/store/slices/favoriteSlice";

type Props = { propertyId: string; className?: string };

export default function FavoriteButton({ propertyId, className = "" }: Props) {
    const t = useTranslations("Properties.favorite");
    const locale = useLocale() as "ar" | "en";
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        setLoggedIn(!!cookieHelper.get("dealora_token"));
    }, []);

    // one shared request for all the hearts on the page; guests don't fetch anything
    const { data } = useListFavoriteQuery({ lang: locale }, { skip: !loggedIn });
    const [addFavorite, { isLoading: adding }] = useAddToFavoriteMutation();
    const [removeFavorite, { isLoading: removing }] = useDaleteFavoritMutation();

    const isFavorite = data?.data.some((p) => p._id === propertyId) ?? false;

    async function toggle() {
        if (!loggedIn) {
            toast(t("loginRequired"));
            router.push("/login");
            return;
        }
        try {
            await (isFavorite ? removeFavorite(propertyId) : addFavorite(propertyId)).unwrap();
        } catch (err) {
            toast.error(parseApiError(err, t("failed")).message);
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={adding || removing}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? t("remove") : t("add")}
            className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow backdrop-blur transition-transform hover:scale-110 disabled:opacity-60 ${className}`}
        >
            <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
        </button>
    );
}