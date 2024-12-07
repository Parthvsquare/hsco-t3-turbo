import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportRouter = createTRPCRouter({
  // createReportTable: protectedProcedure
  //   .input(
  //     z.object({
  //       userId: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const { userId } = input;
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 30);
  //     const savedWeight = await ctx.prisma.weightDatabase.deleteMany({
  //       where: {
  //         userId,
  //         createdAt: {
  //           gte: yesterday,
  //           lt: new Date(),
  //         },
  //       },
  //     });
  //     console.log(savedWeight.count);
  //     const savedLiter = await ctx.prisma.literDatabase.deleteMany({
  //       where: {
  //         userId,
  //         createdAt: {
  //           gte: yesterday,
  //           lt: new Date(),
  //         },
  //       },
  //     });
  //     const savedPieceCounting =
  //       await ctx.prisma.pieceCountingDatabase.deleteMany({
  //         where: {
  //           userId,
  //           createdAt: {
  //             gte: yesterday,
  //             lt: new Date(),
  //           },
  //         },
  //       });
  //     const savedGrades = await ctx.prisma.gradeDatabase.deleteMany({
  //       where: {
  //         userId,
  //         createdAt: {
  //           gte: yesterday,
  //           lt: new Date(),
  //         },
  //       },
  //     });
  //     const alertDatabase = await ctx.prisma.alertDatabase.deleteMany({
  //       where: {
  //         userId,
  //         createdAt: {
  //           gte: yesterday,
  //           lt: new Date(),
  //         },
  //       },
  //     });
  //     const savedReportDB = await ctx.prisma.reportDatabse.deleteMany({
  //       where: {
  //         userId,
  //         generatedFor: {
  //           gte: yesterday,
  //           lt: new Date(),
  //         },
  //       },
  //     });
  //     return {
  //       savedWeightDeleted: savedWeight.count,
  //       savedLiterDeleted: savedLiter.count,
  //       savedPieceCountingDeleted: savedPieceCounting.count,
  //       savedGradesDeleted: savedGrades.count,
  //       alertDatabaseDeleted: alertDatabase.count,
  //       savedReportDBDeleted: savedReportDB.count,
  //     };
  //   }),
  // getReportTable: protectedProcedure
  //   .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
  //   .query(async ({ ctx, input }) => {
  //     const { page, pageLength } = input;
  //     const skipByOffset = (page - 1) * pageLength;
  //     const reportDb = await ctx.prisma.reportDatabse.findMany({
  //       take: pageLength,
  //       skip: skipByOffset,
  //       where: { userId: ctx.auth.userId },
  //       orderBy: {
  //         generatedFor: "desc",
  //       },
  //     });
  //     const reportDbTotalCount = await ctx.prisma.reportDatabse.count({
  //       where: { userId: ctx.auth.userId },
  //     });
  //     return { data: reportDb, totalCount: reportDbTotalCount };
  //   }),
  // deleteReport: protectedProcedure
  //   .input(z.object({ reportId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const getReportDb = await ctx.prisma.reportDatabse
  //       .findUnique({
  //         where: {
  //           reportId: input.reportId,
  //         },
  //         include: {
  //           ReportDatabseAverages: true,
  //         },
  //       })
  //       .catch((error) => {
  //         throw new TRPCError({
  //           code: "NOT_FOUND",
  //           message: `No Report with report id: ${input.reportId} found`,
  //           cause: error,
  //         });
  //       });
  //     if (
  //       getReportDb?.ReportDatabseAverages &&
  //       getReportDb.ReportDatabseAverages.id
  //     ) {
  //       await ctx.prisma.reportDatabaseAverages.delete({
  //         where: {
  //           id: getReportDb?.ReportDatabseAverages?.id,
  //         },
  //       });
  //     }
  //     const reportDb = await ctx.prisma.reportDatabse
  //       .delete({
  //         where: {
  //           reportId: input.reportId,
  //         },
  //       })
  //       .catch((error) => {
  //         throw new TRPCError({
  //           code: "INTERNAL_SERVER_ERROR",
  //           message: `Can't delete report with id: ${input.reportId}`,
  //           cause: error,
  //         });
  //       });
  //     return { data: reportDb };
  //   }),
  // getReportDetails: protectedProcedure
  //   .input(z.object({ reportId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const reportDb = await ctx.prisma.reportDatabse.findUnique({
  //       where: { reportId: input.reportId },
  //       include: {
  //         savedAlerts: true,
  //         savedGrades: true,
  //         savedLiters: true,
  //         savedWeights: true,
  //         savedPieceCounting: true,
  //       },
  //     });
  //     return reportDb;
  //   }),
});
