import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, asc, desc, eq } from "@acme/db";
import { createGradeTemplate, GradeSystemTemplate } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gradeTemplateRouter = createTRPCRouter({
  getMarketSavedGrading: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.GradeSystemTemplate.findMany({
        orderBy: desc(GradeSystemTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.makePublic, true);
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(GradeSystemTemplate)
          .where(and(eq(GradeSystemTemplate.makePublic, true)))
      ).length;
      return { data, totalCount };
    }),
  getMySavedGrading: protectedProcedure
    .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.GradeSystemTemplate.findMany({
        orderBy: desc(GradeSystemTemplate.createdAt),
        limit: input.pageLength,
        offset: (input.page - 1) * input.pageLength,
        where(fields, operators) {
          return operators.eq(fields.user, ctx.session.user.id);
        },
      });

      const totalCount = (
        await ctx.db
          .select()
          .from(GradeSystemTemplate)
          .where(and(eq(GradeSystemTemplate.user, ctx.session.user.id)))
      ).length;
      return { data, totalCount };
    }),
  //template api
  saveGradeTemplate: protectedProcedure
    .input(createGradeTemplate)
    .mutation(({ ctx, input }) => {
      let createdBy: string;
      if (input.createdBy) {
        createdBy = input.createdBy;
      } else {
        createdBy = ctx.session.user.id;
      }
      return ctx.db.insert(GradeSystemTemplate).values({
        itemName: input.itemName,
        gradeName: input.gradeName,
        gradeLowerLimit: input.gradeLowerLimit.toString(),
        gradeUpperLimit: input.gradeUpperLimit.toString(),
        makePublic: input.makePublic,
        createdBy: createdBy,
        user: ctx.session.user.id,
      });
    }),
  // deleteSavedGradeTemplate: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .mutation(({ ctx, input }) => {
  //     return ctx.db
  //       .delete(GradeSystemTemplate)
  //       .where(
  //         and(
  //           eq(GradeSystemTemplate.user, ctx.session.user.id),
  //           eq(GradeSystemTemplate.itemName, input.itemName),
  //         ),
  //       );
  //   }),
  updateSavedGradeTemplate: protectedProcedure
    .input(
      z.object({
        gradeId: z.string(),
        itemName: z.string(),
        gradeName: z.string(),
        gradeLowerLimit: z.number().multipleOf(0.0001),
        gradeUpperLimit: z.number().multipleOf(0.0001),
        makePublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(GradeSystemTemplate)
        .set({
          itemName: input.itemName,
          gradeName: input.gradeName,
          gradeLowerLimit: input.gradeLowerLimit.toString(),
          gradeUpperLimit: input.gradeUpperLimit.toString(),
          makePublic: input.makePublic,
          user: ctx.session.user.id,
        })
        .where(
          and(
            eq(GradeSystemTemplate.user, ctx.session.user.id),
            eq(GradeSystemTemplate.itemName, input.itemName),
          ),
        );
    }),
  deleteMyGradeTemplate: protectedProcedure
    .input(z.object({ gradeId: z.string(), gradeTemplateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(GradeSystemTemplate)
        .where(
          and(
            eq(GradeSystemTemplate.user, ctx.session.user.id),
            eq(GradeSystemTemplate.gradeTemaplateId, input.gradeTemplateId),
          ),
        );
    }),
  // deleteMyGradeTemplateByName: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeSystemTemplate.deleteMany({
  //       where: { itemName: input.itemName, userId: ctx.auth.userId },
  //     });
  //     return { data: data };
  //   }),
  getAllMyGradesTemplate: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(GradeSystemTemplate)
      .groupBy(GradeSystemTemplate.itemName)
      .orderBy(asc(GradeSystemTemplate.createdAt))
      .where(and(eq(GradeSystemTemplate.user, ctx.session.user.id)));
  }),
  getMyGradeTemplateByItemName: protectedProcedure
    .input(z.object({ itemName: z.string() }))
    .query(async ({ ctx, input }) => {
      const { itemName } = input;

      return await ctx.db
        .select()
        .from(GradeSystemTemplate)
        .where(
          and(
            eq(GradeSystemTemplate.user, ctx.session.user.id),
            eq(GradeSystemTemplate.itemName, itemName),
          ),
        );
    }),
  getMarketGradeTemplateByItemName: protectedProcedure
    .input(z.object({ itemName: z.string() }))
    .query(async ({ ctx, input }) => {
      const { itemName } = input;

      return await ctx.db
        .select()
        .from(GradeSystemTemplate)
        .where(
          and(
            eq(GradeSystemTemplate.makePublic, true),
            eq(GradeSystemTemplate.itemName, itemName),
          ),
        );
    }),
  // getAllGradeTemplateByUsers: protectedProcedure
  //   .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
  //   .query(async ({ ctx, input }) => {
  //     const usersDetail = await ctx.prisma.user
  //       .findUnique({
  //         where: {
  //           id: ctx.auth.userId,
  //         },
  //       })
  //       .catch((e) => {
  //         throw new TRPCError({
  //           code: "CONFLICT",
  //           cause: "Can't find users",
  //           message: e,
  //         });
  //       });
  //     if (usersDetail && (usersDetail.role === Role.ADMIN || Role.EDITOR)) {
  //       const { page, pageLength } = input;
  //       const skipByOffset = (page - 1) * pageLength;

  //       const gradingTemplate = await ctx.prisma.gradeSystemTemplate.findMany({
  //         take: pageLength,
  //         skip: skipByOffset,
  //         include: { createdBy: true },
  //       });
  //       const gradingTotalCount = await ctx.prisma.gradeSystemTemplate.count();

  //       return { data: gradingTemplate, totalCount: gradingTotalCount };
  //     } else {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         cause: "Please check your role",
  //         message: "Only admin can call this api",
  //       });
  //     }
  //   }),
});
