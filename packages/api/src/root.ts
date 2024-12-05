import { authRouter } from "./router/auth";
import { literRouter } from "./router/liter";
import { postRouter } from "./router/post";
import { weightRouter } from "./router/weight";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  weight: weightRouter,
  liter: literRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
