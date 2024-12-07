import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import {
  AlertSystemTemplate,
  createAlertTemplate,
  createWeight,
  WeightDatabase,
} from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const alarmTemplateRouter = {
  //template api
  saveAlarmTemplate: protectedProcedure
    .input(createAlertTemplate)
    .mutation(({ ctx, input }) => {
      // return ctx.prisma.alertSystemTemplate.create({
      //   data: {
      //     itemName: input.itemName,
      //     userId: ctx.auth.userId,
      //     alertLowerLimit: input.alertLowerLimit,
      //     alertUpperLimit: input.alertUpperLimit,
      //     makePublic: input.makePublic ?? false,
      //   },
      // });

      if (input.createdBy == "" || input.createdBy == null) {
        input.createdBy = ctx.session.user.id;
      }

      return ctx.db.insert(AlertSystemTemplate).values({
        itemName: input.itemName,
        user: ctx.session.user.id,
        createdBy: input.createdBy,
        alertLowerLimit: input.alertLowerLimit.toString(),
        alertUpperLimit: input.alertUpperLimit.toString(),
      });
    }),
  deleteSavedAlarmTemplate: protectedProcedure
    .input(z.object({ alertTemplateId: z.number().multipleOf(0.0001) }))
    .mutation(({ ctx, input }) => {
      // const data = await ctx.prisma.alertSystemTemplate.delete({
      //   where: { alertId: input.alertId },
      // });
      // return { data: data };
      return ctx.db
        .delete(AlertSystemTemplate)
        .where(
          and(
            eq(AlertSystemTemplate.user, ctx.session.user.id),
            eq(AlertSystemTemplate.alertTemplateId, input.alertTemplateId),
          ),
        )
        .returning();
    }),

  getAllMySavedAlarmTemplate: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.AlertDatabase.findMany({
        orderBy: desc(AlertSystemTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.user, ctx.session.user.id);
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(AlertSystemTemplate)
          .where(eq(AlertSystemTemplate.user, ctx.session.user.id))
      ).length;

      return { data, totalCount };
    }),
  getAllAlarmTemplate: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.AlertSystemTemplate.findMany({
        orderBy: desc(AlertSystemTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.and(
            eq(fields.user, ctx.session.user.id),
            eq(fields.makePublic, true),
          );
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(AlertSystemTemplate)
          .where(
            and(
              eq(AlertSystemTemplate.user, ctx.session.user.id),
              eq(AlertSystemTemplate.makePublic, true),
            ),
          )
      ).length;

      return { data, totalCount };
    }),
} satisfies TRPCRouterRecord;
