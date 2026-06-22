import { z } from "zod";
import { USER_ROLES } from "../utils";

export const getUserSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.email(),
    name: z.string().min(2),
    password: z.string().min(8)
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email:z.email(),
    password:z.string()
  })
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name:z.string().optional(),
    email:z.email().optional(),
    isActive:z.boolean().optional(),
    roles:z.array(z.enum([...Object.values(USER_ROLES)])).optional()
  })
})


export type CreateUserInput =
  z.infer<typeof createUserSchema>;