import { z } from "zod";

export function createEmailSchema(t: any) {
  return z
    .string({ message: t("invalidEmailFormat") })
    .email(t("invalidEmailFormat"));
}

export function createPasswordSchema(t: any) {
  return z
    .string({ message: t("enterPassword") })
    .min(1, t("enterPassword"))
    .min(8, t("passwordAtLeast8"));
}

export function createNameSchema(t: any) {
  return z
    .string({ message: t("enterYourName") })
    .min(1, t("enterYourName"))
    .min(2, t("nameAtLeast2Chars"));
}
