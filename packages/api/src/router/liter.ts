import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import { createLiter, LiterDatabase } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const literRouter = {
  saveLiter: protectedProcedure
    .input(createLiter)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(LiterDatabase).values({
        user: ctx.session.user.id,
        liter: input.liter.toString(),
      });
    }),
  updateLiter: protectedProcedure
    .input(
      z.object({ literId: z.number().multipleOf(0.0001), weight: z.number() }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(LiterDatabase)
        .set({
          liter: input.weight.toString(),
        })
        .where(eq(LiterDatabase.literId, input.literId));
    }),
  deleteSavedLiter: protectedProcedure
    .input(z.object({ literId: z.number().multipleOf(0.0001) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(LiterDatabase)
        .where(
          and(
            eq(LiterDatabase.user, ctx.session.user.id),
            eq(LiterDatabase.literId, input.literId),
          ),
        )
        .returning();
    }),
  getAllSavedLiter: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.LiterDatabase.findMany({
      orderBy: desc(LiterDatabase.createdAt),
      where(fields, operators) {
        return operators.eq(fields.user, ctx.session.user.id);
      },
    });
  }),
} satisfies TRPCRouterRecord;
