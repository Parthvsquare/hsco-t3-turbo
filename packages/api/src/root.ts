import { alarmRouter } from "./router/alarm";
import { authRouter } from "./router/auth";
import { literRouter } from "./router/liter";
import { pieceCountingRouter } from "./router/pieceCounting";
import { pieceCountingTemplateRouter } from "./router/pieceTemplate";
import { postRouter } from "./router/post";
import { weightRouter } from "./router/weight";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  weight: weightRouter,
  liter: literRouter,
  pieceCounting: pieceCountingRouter,
  pieceCountingTemplate: pieceCountingTemplateRouter,
  alert: alarmRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
