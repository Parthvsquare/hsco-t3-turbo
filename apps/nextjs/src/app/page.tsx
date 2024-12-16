// import { createElement, useState } from "react";
// import { useRouter } from "next/navigation";

import { HydrateClient } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";

// import {
//   CreatePostForm,
//   PostCardSkeleton,
//   PostList,
// } from "./_components/posts";

// export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  // const router = useRouter();
  // const { breadCrumb } = useBreadCrumbs();

  // const { data: session } = useSession()

  // const sliderHidden = useMemo(
  //   () => (typeof window === "undefined" ? isSignedIn : false),
  //   [isSignedIn],
  // );

  return (
    <HydrateClient>
      <AuthShowcase />
      <main className="container h-screen py-16"></main>
    </HydrateClient>
  );
}
