import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const TOKEN_KEY = 'dealora_token';

export const cookieHelper = {
  get(name: string): string | null {
    return (getCookie(name) as string) ?? null;
  },

  set(name: string, value: string, days = 7) {
    setCookie(name, value, {
      maxAge: days * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });
  },

  remove(name: string) {
    deleteCookie(name, { path: '/' });
  },
};