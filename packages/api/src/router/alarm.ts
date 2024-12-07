import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import { AlertDatabase, createAlert } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const alarmRouter = {
  saveAlarm: protectedProcedure
    .input(createAlert)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(AlertDatabase).values({
        user: ctx.session.user.id,
        itemName: input.itemName,
        alertUpperLimit: input.alertUpperLimit.toString(),
        alertLowerLimit: input.alertLowerLimit.toString(),
      });
    }),
  updateAlert: protectedProcedure
    .input(
      z.object({
        alertId: z.number(),
        itemName: z.string(),
        alertUpperLimit: z.number(),
        alertLowerLimit: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(AlertDatabase)
        .set({
          itemName: input.itemName,
          alertUpperLimit: input.alertUpperLimit.toString(),
          alertLowerLimit: input.alertLowerLimit.toString(),
        })
        .where(
          and(
            eq(AlertDatabase.user, ctx.session.user.id),
            eq(AlertDatabase.alertId, input.alertId),
          ),
        );
    }),
  deleteSavedAlarm: protectedProcedure
    .input(z.object({ alertId: z.number().multipleOf(0.0001) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(AlertDatabase)
        .where(
          and(
            eq(AlertDatabase.user, ctx.session.user.id),
            eq(AlertDatabase.alertId, input.alertId),
          ),
        )
        .returning();
    }),
  getAllSavedAlarm: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.AlertDatabase.findMany({
        orderBy: desc(AlertDatabase.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.user, ctx.session.user.id);
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(AlertDatabase)
          .where(eq(AlertDatabase.user, ctx.session.user.id))
      ).length;

      return { data, totalCount };
    }),
} satisfies TRPCRouterRecord;
