// import { router, protectedProcedure } from "../trpc";

// export const averageReportRouter = router({
//   getAllSavedAverages: protectedProcedure.query(async ({ ctx }) => {
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//     const averageReportDatabase =
//       await ctx.prisma.reportDatabaseAverages.findMany({
//         where: {
//           userId: ctx.auth.userId,
//           generatedFor: {
//             gte: oneWeekAgo,
//           },
//         },
//       });
//     const averageReportTotalCount =
//       await ctx.prisma.reportDatabaseAverages.count({
//         where: {
//           userId: ctx.auth.userId,
//           generatedFor: {
//             gte: oneWeekAgo,
//           },
//         },
//       });

//     return {
//       data: averageReportDatabase,
//       totalCount: averageReportTotalCount,
//     };
//   }),
// });
