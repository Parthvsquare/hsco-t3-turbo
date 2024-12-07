import { z } from "zod";

import { sql } from "@acme/db";
import { Address } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const addressRouter = createTRPCRouter({
  saveAddress: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        stateDistrict: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(Address).values({
        user: ctx.session.user.id,
        latitude: input.latitude,
        longitude: input.longitude,
        stateDistrict: input.stateDistrict,
      });
    }),
  updateAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        stateDistrict: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(Address).values({
        addressId: input.addressId,
        user: ctx.session.user.id,
        latitude: input.latitude,
        longitude: input.longitude,
        stateDistrict: input.stateDistrict,
      });
    }),
  deleteSavedAddress: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.delete(Address).where(sql`user = ${ctx.session.user.id}`);
  }),
});
