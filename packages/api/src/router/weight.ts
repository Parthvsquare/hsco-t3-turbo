import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import { createWeight, WeightDatabase } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const weightRouter = {
  saveWeight: protectedProcedure
    .input(createWeight)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(WeightDatabase).values({
        user: ctx.session.user.id,
        weight: input.weight.toString(),
      });
    }),
  updateWeight: protectedProcedure
    .input(
      z.object({ weightId: z.number().multipleOf(0.0001), weight: z.number() }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(WeightDatabase)
        .set({
          weight: input.weight.toString(),
        })
        .where(eq(WeightDatabase.weightId, input.weightId));
    }),
  deleteSavedWeight: protectedProcedure
    .input(z.object({ weightId: z.number().multipleOf(0.0001) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(WeightDatabase)
        .where(
          and(
            eq(WeightDatabase.user, ctx.session.user.id),
            eq(WeightDatabase.weightId, input.weightId),
          ),
        )
        .returning();
    }),
  getAllSavedWeight: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.WeightDatabase.findMany({
      orderBy: desc(WeightDatabase.createdAt),
      where(fields, operators) {
        return operators.eq(fields.user, ctx.session.user.id);
      },
    });
  }),
} satisfies TRPCRouterRecord;
