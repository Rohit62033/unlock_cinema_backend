import { z } from "zod";

export const createTheatreSchema = z.object({
  name: z.string().min(3),
  cityName: z.string(),
  address: z.string(),
});