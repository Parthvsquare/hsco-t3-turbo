import { z } from "zod";

import { and, desc, eq } from "@acme/db";
import {
  createPieceTemplateCounter,
  PieceCountingTemplate,
} from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pieceCountingTemplateRouter = createTRPCRouter({
  savePieceCountTemplate: protectedProcedure
    .input(createPieceTemplateCounter)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(PieceCountingTemplate).values({
        itemName: input.itemName,
        user: ctx.session.user.id,
        singlePieceWeight: input.singlePieceWeight.toString(),
        createdBy: ctx.session.user.id,
        description: input.description,
        makePublic: input.makePublic,
      });
    }),
  deleteMyPieceCountTemplate: protectedProcedure
    .input(z.object({ pieceId: z.string() }))
    .mutation(({ ctx, input }) => {
      // const data = await ctx.prisma.pieceCountingTemplate.delete({
      //   where: { userId: ctx.auth.userId, pieceId: input.pieceId },
      // });

      // return { data: data };
      return ctx.db
        .delete(PieceCountingTemplate)
        .where(
          and(
            eq(PieceCountingTemplate.user, ctx.session.user.id),
            eq(PieceCountingTemplate.itemName, input.pieceId),
          ),
        );
    }),
  getAllMyPieceCountTemplate: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.PieceCountingDatabase.findMany({
        orderBy: desc(PieceCountingTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.user, ctx.session.user.id);
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(PieceCountingTemplate)
          .where(and(eq(PieceCountingTemplate.user, ctx.session.user.id)))
      ).length;
      return { data, totalCount };
    }),
  getAllPieceCountTemplate: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.PieceCountingTemplate.findMany({
        orderBy: desc(PieceCountingTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.and(eq(fields.makePublic, true));
        },
      });
      const totalCount = (
        await ctx.db
          .select()
          .from(PieceCountingTemplate)
          .where(and(eq(PieceCountingTemplate.makePublic, true)))
      ).length;
      return { data, totalCount };
    }),

  // //template api
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
