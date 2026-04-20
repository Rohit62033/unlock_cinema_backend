import z from "zod";

export const updateProfileSchema = z.object({
  name:z.string().optional(),
  avatar:z.string().optional()
})

export const changePasswordSchema = z.object({
  currentPassword:z.string().min(6),
   newPassword:z.string().min(6)
})