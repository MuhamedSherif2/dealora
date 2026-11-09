"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "@/i18n/navigation";
import { cookieHelper, TOKEN_KEY } from "@/lib/cookies";
import { authApi } from "@/store/slices/authSlice";
// استورد باقي الـ APIs عندك (أسماء الـ slices عندك مختلفة، عدّلها):
// import { adminApi } from "@/store/slices/adminSlice";
// import { propertyApi } from "@/store/slices/propertySlice";

export function useLogout() {
    const dispatch = useDispatch();
    const router = useRouter();

    return function logout() {
        cookieHelper.remove(TOKEN_KEY);
        cookieHelper.remove("dealora_user_role");

        // clear every cached response so the next user never sees this user's data
        dispatch(authApi.util.resetApiState());
        // dispatch(adminApi.util.resetApiState());
        // dispatch(propertyApi.util.resetApiState());

        router.replace("/login");
    };
}