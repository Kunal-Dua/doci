import z from "zod";

const userSignup = z.object({
  email: z.email(),
  password: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const userSignin = z.object({
  email: z.email(),
  password: z.string(),
});

const userUpdate = z.object({
  email: z.email().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export { userSignup, userSignin, userUpdate };
