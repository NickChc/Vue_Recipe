export function isAuthPath(fullpath: string) {
  const authPaths = ["/register", "/sign-in"];

  const result = authPaths.some((path) => fullpath.endsWith(path));

  return result;
}
