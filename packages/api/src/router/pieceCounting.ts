import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import { createPieceCounter, PieceCountingDatabase } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pieceCountingRouter = createTRPCRouter({
  savePieceCount: protectedProcedure
    .input(createPieceCounter)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(PieceCountingDatabase).values({
        itemName: input.itemName,
        user: ctx.session.user.id,
        singlePieceWeight: input.singlePieceWeight.toString(),
        itemsCounted: input.itemsCounted,
      });
    }),
  updatePieceCount: protectedProcedure
    .input(createPieceCounter)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(PieceCountingDatabase)
        .set({
          user: ctx.session.user.id,
          itemName: input.itemName,
        })
        .where(
          and(
            eq(PieceCountingDatabase.user, ctx.session.user.id),
            eq(PieceCountingDatabase.itemName, input.itemName),
          ),
        );
    }),
  deleteSavedPieceCount: protectedProcedure
    .input(z.object({ pieceId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(PieceCountingDatabase)
        .where(
          and(
            eq(PieceCountingDatabase.user, ctx.session.user.id),
            eq(PieceCountingDatabase.itemName, input.pieceId),
          ),
        );
    }),
  getAllSavedPieceCount: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.PieceCountingDatabase.findMany({
        orderBy: desc(PieceCountingDatabase.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.user, ctx.session.user.id);
        },
      });
      const totalCount = (
        await ctx.db
          .select()
          .from(PieceCountingDatabase)
          .where(and(eq(PieceCountingDatabase.user, ctx.session.user.id)))
      ).length;
      return { data, totalCount };
    }),

  // //template api
  // savePieceCountTemplate: protectedProcedure
  //   .input(
  //     z.object({
  //       itemName: z.string(),
  //       singlePieceWeight: z.number(),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.pieceCountingTemplate.create({
  //       data: {
  //         itemName: input.itemName,
  //         singlePieceWeight: input.singlePieceWeight,
  //         userId: ctx.auth.userId,
  //       },
  //     });
  //   }),
  // deleteMyPieceCountTemplate: protectedProcedure
  //   .input(z.object({ pieceId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.pieceCountingTemplate.delete({
  //       where: { userId: ctx.auth.userId, pieceId: input.pieceId },
  //     });

  //     return { data: data };
  //   }),
  // getAllMyPieceCountTemplate: protectedProcedure
  //   .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
  //   .query(async ({ ctx, input }) => {
  //     const { page, pageLength } = input;
  //     const skipByOffset = (page - 1) * pageLength;

  //     const pieceCountTemplate =
  //       await ctx.prisma.pieceCountingTemplate.findMany({
  //         take: pageLength,
  //         skip: skipByOffset,
  //         where: { userId: ctx.auth.userId },
  //       });
  //     const pieceCountingTotalCount =
  //       await ctx.prisma.pieceCountingTemplate.count({
  //         where: { userId: ctx.auth.userId },
  //       });

  //     return {
  //       data: pieceCountTemplate,
  //       totalCount: pieceCountingTotalCount,
  //     };
  //   }),
  // getAllPieceCountTemplate: protectedProcedure
  //   .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
  //   .query(async ({ ctx, input }) => {
  //     const { page, pageLength } = input;
  //     const skipByOffset = (page - 1) * pageLength;

  //     const pieceCountTemplate =
  //       await ctx.prisma.pieceCountingTemplate.findMany({
  //         take: pageLength,
  //         skip: skipByOffset,
  //         where: { makePublic: true },
  //       });
  //     const pieceCountingTotalCount =
  //       await ctx.prisma.pieceCountingTemplate.count({
  //         where: { makePublic: true },
  //       });

  //     return { data: pieceCountTemplate, totalCount: pieceCountingTotalCount };
  //   }),
});
