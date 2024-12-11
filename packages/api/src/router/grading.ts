import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@acme/db";
import { GradeDatabase } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gradeRouter = createTRPCRouter({
  saveGrade: protectedProcedure
    .input(
      z.object({
        itemName: z.string(),
        gradeName: z.string(),
        gradeLowerLimit: z.number().multipleOf(0.0001),
        gradeUpperLimit: z.number().multipleOf(0.0001),
        gradedItemWeight: z.number().multipleOf(0.0001),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(GradeDatabase).values({
        itemName: input.itemName,
        gradeName: input.gradeName,
        gradeLowerLimit: input.gradeLowerLimit.toString(),
        gradeUpperLimit: input.gradeUpperLimit.toString(),
        gradedItemWeight: input.gradedItemWeight.toString(),
        user: ctx.session.user.id,
      });
    }),
  updateSavedGrading: protectedProcedure
    .input(
      z.object({
        gradeId: z.number(),
        itemName: z.string(),
        gradeName: z.string(),
        gradeLowerLimit: z.number().multipleOf(0.0001),
        gradeUpperLimit: z.number().multipleOf(0.0001),
        gradedItemWeight: z.number().multipleOf(0.0001),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(GradeDatabase)
        .set({
          itemName: input.itemName,
          gradeName: input.gradeName,
          gradeLowerLimit: input.gradeLowerLimit.toString(),
          gradeUpperLimit: input.gradeUpperLimit.toString(),
          gradedItemWeight: input.gradedItemWeight.toString(),
        })
        .where(
          and(
            eq(GradeDatabase.gradeId, input.gradeId),
            eq(GradeDatabase.user, ctx.session.user.id),
          ),
        );
    }),
  deleteSavedGrades: protectedProcedure
    .input(z.object({ gradeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(GradeDatabase)
        .where(
          and(
            eq(GradeDatabase.gradeId, input.gradeId),
            eq(GradeDatabase.user, ctx.session.user.id),
          ),
        );
    }),
  // deleteSavedGradeTemplate: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeDatabase.deleteMany({
  //       where: { itemName: input.itemName, userId: ctx.auth.userId },
  //     });
  //     return { data: data };
  //   }),
  // getAllSavedGrading: protectedProcedure
  //   .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
  //   .query(async ({ ctx, input }) => {
  //     const { page, pageLength } = input;
  //     const skipByOffset = (page - 1) * pageLength;

  //     const gradingDatabase = await ctx.prisma.gradeDatabase.findMany({
  //       take: pageLength,
  //       skip: skipByOffset,
  //       where: { userId: ctx.auth.userId },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });
  //     const gradingTotalCount = await ctx.prisma.gradeDatabase.count({
  //       where: { userId: ctx.auth.userId },
  //     });

  //     return { data: gradingDatabase, totalCount: gradingTotalCount };
  //   }),
  // //template api
  // saveGradeTemplate: protectedProcedure
  //   .input(
  //     z.object({
  //       itemName: z.string(),
  //       gradeName: z.string(),
  //       gradeLowerLimit: z.number(),
  //       gradeUpperLimit: z.number(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeSystemTemplate.create({
  //       data: {
  //         itemName: input.itemName,
  //         gradeName: input.gradeName,
  //         gradeLowerLimit: input.gradeLowerLimit,
  //         gradeUpperLimit: input.gradeUpperLimit,
  //         userId: ctx.auth.userId,
  //       },
  //     });
  //     return { data: data };
  //   }),
  // updateSavedGradingTemplate: protectedProcedure
  //   .input(
  //     z.object({
  //       gradeId: z.string(),
  //       itemName: z.string(),
  //       gradeName: z.string(),
  //       gradeLowerLimit: z.number(),
  //       gradeUpperLimit: z.number(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeSystemTemplate.update({
  //       where: {
  //         gradeId: input.gradeId,
  //       },
  //       data: {
  //         itemName: input.itemName,
  //         gradeName: input.gradeName,
  //         gradeLowerLimit: input.gradeLowerLimit,
  //         gradeUpperLimit: input.gradeUpperLimit,
  //         userId: ctx.auth.userId,
  //       },
  //     });
  //     return { data: data };
  //   }),
  // deleteMyGrade: protectedProcedure
  //   .input(z.object({ gradeId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeSystemTemplate.delete({
  //       where: { gradeId: input.gradeId },
  //     });
  //     return { data: data };
  //   }),
  // deleteMyGradeTemplateByName: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.gradeSystemTemplate.deleteMany({
  //       where: { itemName: input.itemName, userId: ctx.auth.userId },
  //     });
  //     return { data: data };
  //   }),
  // getAllMyGradesTemplate: protectedProcedure.query(async ({ ctx }) => {
  //   const gradeItemNameTemplate = await ctx.prisma.gradeSystemTemplate.groupBy({
  //     by: ["itemName"],
  //     where: {
  //       userId: ctx.auth.userId,
  //     },
  //     orderBy: {
  //       itemName: "asc",
  //     },
  //   });

  //   return {
  //     data: gradeItemNameTemplate,
  //   };
  // }),
  // getAllMyGradeByItemsNameTemplate: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const { itemName } = input;

  //     const gradingTemplate = await ctx.prisma.gradeSystemTemplate.findMany({
  //       where: { userId: ctx.auth.userId, itemName: itemName },
  //     });
  //     const gradingTotalCount = await ctx.prisma.gradeSystemTemplate.count({
  //       where: { userId: ctx.auth.userId, itemName: itemName },
  //     });

  //     return { data: gradingTemplate, totalCount: gradingTotalCount };
  //   }),
  // getAllGradeTemplate: protectedProcedure
  //   .input(z.object({ itemName: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const { itemName } = input;

  //     const gradingTemplate = await ctx.prisma.gradeSystemTemplate.findMany({
  //       where: { makePublic: true, itemName: itemName },
  //       include: { createdBy: true },
  //     });
  //     const gradingTotalCount = await ctx.prisma.gradeSystemTemplate.count({
  //       where: { makePublic: true, itemName: itemName },
  //     });

  //     return { data: gradingTemplate, totalCount: gradingTotalCount };
  //   }),
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
