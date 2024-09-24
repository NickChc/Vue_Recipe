import { AUTH_ROUTES } from "@/router";

export function isAuthPath(fullpath: string) {
  const result = AUTH_ROUTES.some((path) => fullpath.endsWith(path));

  return result;
}
