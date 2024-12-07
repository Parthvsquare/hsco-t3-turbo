// import { TRPCError } from "@trpc/server";
// import { router, protectedProcedure } from "../trpc";
// import { z } from "zod";
// import { Role } from "@acme/db";

// export const pieceCountingRouter = router({
//   savePieceCount: protectedProcedure
//     .input(
//       z.object({
//         itemName: z.string(),
//         singlePieceWeight: z.number(),
//         itemsCounted: z.number(),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.pieceCountingDatabase.create({
//         data: {
//           itemName: input.itemName,
//           singlePieceWeight: input.singlePieceWeight,
//           userId: ctx.auth.userId,
//           itemsCounted: input.itemsCounted,
//         },
//       });
//     }),
//   updateSavedPieceCount: protectedProcedure
//     .input(
//       z.object({
//         pieceId: z.string(),
//         itemName: z.string(),
//         singlePieceWeight: z.number(),
//         itemsCounted: z.number(),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.pieceCountingDatabase.update({
//         where: {
//           pieceId: input.pieceId,
//         },
//         data: {
//           itemsCounted: input.itemsCounted,
//           itemName: input.itemName,
//           singlePieceWeight: input.singlePieceWeight,
//           userId: ctx.auth.userId,
//         },
//       });
//     }),
//   deleteSavedPieceCount: protectedProcedure
//     .input(z.object({ pieceId: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const data = await ctx.prisma.pieceCountingDatabase.delete({
//         where: { pieceId: input.pieceId },
//       });
//       return { data: data };
//     }),
//   getAllSavedPieceCount: protectedProcedure
//     .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
//     .query(async ({ ctx, input }) => {
//       const { page, pageLength } = input;
//       const skipByOffset = (page - 1) * pageLength;

//       const pieceCountDatabase =
//         await ctx.prisma.pieceCountingDatabase.findMany({
//           take: pageLength,
//           skip: skipByOffset,
//           where: { userId: ctx.auth.userId },
//           orderBy: {
//             createdAt: "desc",
//           },
//         });
//       const pieceCountingTotalCount =
//         await ctx.prisma.pieceCountingDatabase.count({
//           where: { userId: ctx.auth.userId },
//         });

//       return { data: pieceCountDatabase, totalCount: pieceCountingTotalCount };
//     }),
//   //template api
//   savePieceCountTemplate: protectedProcedure
//     .input(
//       z.object({
//         itemName: z.string(),
//         singlePieceWeight: z.number(),
//         makePublic: z.boolean().optional(),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.pieceCountingTemplate.create({
//         data: {
//           itemName: input.itemName,
//           singlePieceWeight: input.singlePieceWeight,
//           userId: ctx.auth.userId,
//           makePublic: input.makePublic ?? false,
//         },
//       });
//     }),
//   updateSavedPieceCountTemplate: protectedProcedure
//     .input(
//       z.object({
//         pieceId: z.string(),
//         itemName: z.string(),
//         singlePieceWeight: z.number(),
//         makePublic: z.boolean(),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.pieceCountingTemplate.update({
//         where: {
//           pieceId: input.pieceId,
//         },
//         data: {
//           itemName: input.itemName,
//           singlePieceWeight: input.singlePieceWeight,
//           makePublic: input.makePublic,
//           userId: ctx.auth.userId,
//         },
//       });
//     }),
//   searchPieceCountTemplateByName: protectedProcedure
//     .input(z.object({ itemName: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const templatesFound = await ctx.prisma.pieceCountingTemplate.findMany({
//         where: {
//           itemName: {
//             contains: input.itemName,
//           },
//         },
//       });
//       return { data: templatesFound };
//     }),
//   deleteMyPieceCountTemplate: protectedProcedure
//     .input(z.object({ pieceId: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const data = await ctx.prisma.pieceCountingTemplate.delete({
//         where: { pieceId: input.pieceId },
//       });

//       return { data: data };
//     }),
//   getAllMyPieceCountTemplate: protectedProcedure
//     .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
//     .query(async ({ ctx, input }) => {
//       const { page, pageLength } = input;
//       const skipByOffset = (page - 1) * pageLength;

//       const pieceCountTemplate =
//         await ctx.prisma.pieceCountingTemplate.findMany({
//           take: pageLength,
//           skip: skipByOffset,
//           where: { userId: ctx.auth.userId },
//           include: { createdBy: true },
//           orderBy: {
//             itemName: "asc",
//           },
//         });
//       const pieceCountingTotalCount =
//         await ctx.prisma.pieceCountingTemplate.count({
//           where: { userId: ctx.auth.userId },
//         });

//       return {
//         data: pieceCountTemplate,
//         totalCount: pieceCountingTotalCount,
//       };
//     }),
//   getAllPieceCountTemplate: protectedProcedure
//     .input(z.object({ pageLength: z.number(), page: z.number().default(1) }))
//     .query(async ({ ctx, input }) => {
//       const usersDetail = await ctx.prisma.user
//         .findUnique({
//           where: {
//             id: ctx.auth.userId,
//           },
//         })
//         .catch((e) => {
//           throw new TRPCError({
//             code: "CONFLICT",
//             cause: "Can't find users",
//             message: e,
//           });
//         });
//       if (
//         usersDetail &&
//         (usersDetail.role === Role.ADMIN || usersDetail.role === Role.EDITOR)
//       ) {
//         const { page, pageLength } = input;
//         const skipByOffset = (page - 1) * pageLength;

//         const pieceCountTemplate =
//           await ctx.prisma.pieceCountingTemplate.findMany({
//             take: pageLength,
//             skip: skipByOffset,
//             include: { createdBy: true },
//             orderBy: {
//               itemName: "asc",
//             },
//           });
//         const pieceCountingTotalCount =
//           await ctx.prisma.pieceCountingTemplate.count();

//         return {
//           data: pieceCountTemplate,
//           totalCount: pieceCountingTotalCount,
//         };
//       } else {
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           cause: "Please check your role",
//           message: "Only admin can call this api",
//         });
//       }
//     }),
// });
