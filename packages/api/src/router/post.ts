import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return {
      data: "hello",
    };
  }),
} satisfies TRPCRouterRecord;
