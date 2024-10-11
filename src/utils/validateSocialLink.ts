export function validateSocialLink(
  type: "facebook" | "instagram" | "tiktok",
  link: string
) {
  switch (type) {
    case "facebook":
      return link.startsWith("https://facebook.com/") ? true : false;
    case "instagram":
      return link.startsWith("https://instagram.com/") ? true : false;
    case "tiktok":
      return link.startsWith("https://tiktok.com/") ? true : false;
    default:
      return false;
  }
}
