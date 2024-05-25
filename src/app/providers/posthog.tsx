// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    // api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST, //TODO: Uncomment this line if you are using a custom domain
  });
}
export function CSPostHogProvider({ children }: any) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
