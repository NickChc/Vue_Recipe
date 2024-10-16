export function validateSocialLink(url: string, matches: string[]) {
  return matches.some((m) => {
    if (!url.startsWith(m)) {
      return false;
    }

    const urlPattern = /^[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*$/;
    if (!urlPattern.test(url)) {
      return false;
    }

    try {
      const validUrl = new URL(url);

      const path = validUrl.pathname;

      return path.length > 1 && path.startsWith("/");
    } catch (_) {
      return false;
    }
  });
}
