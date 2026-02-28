import z from "zod";

const userSignup = z.object({
  email: z.email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string().optional(),
});

const userSignin = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const userUpdate = z.object({
  password: z.string().min(6).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export { userSignup, userSignin, userUpdate };
