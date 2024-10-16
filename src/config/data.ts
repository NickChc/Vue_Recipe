import { TSocialLinks } from "@/@types/general";
import FacebookIcon from "@/components/icons/FacebookIcon.vue";
import InstagramIcon from "@/components/icons/InstagramIcon.vue";
import TiktokIcon from "@/components/icons/TiktokIcon.vue";

interface TSocialNetwork {
  name: keyof TSocialLinks;
  displayName: string;
  url: string;
  urlMatches: string[];
  icon: typeof TiktokIcon;
}

export const SOCIAL_NETWORKS: TSocialNetwork[] = [
  {
    name: "facebook",
    displayName: "Facebook",
    url: "https://facebook.com",
    urlMatches: ["https://facebook.com", "https://www.facebook.com"],
    icon: FacebookIcon,
  },
  {
    name: "instagram",
    displayName: "Instagram",
    url: "https://instagram.com",
    urlMatches: ["https://instagram.com", "https://www.instagram.com"],
    icon: InstagramIcon,
  },
  {
    name: "tiktok",
    displayName: "TikTok",
    url: "https://tiktok.com",
    urlMatches: ["https://tiktok.com", "https://www.tiktok.com"],
    icon: TiktokIcon,
  },
];
