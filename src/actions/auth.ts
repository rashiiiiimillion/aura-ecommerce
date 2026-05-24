"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { handleActionError, AppError } from "@/lib/utils/errors";
import bcrypt from "bcryptjs";

export async function registerUser(data: unknown) {
  try {
    const validatedData = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // Create an empty cart for the user
    await prisma.cart.create({
      data: { userId: user.id }
    });

    // Create an empty wishlist
    await prisma.wishlist.create({
      data: { userId: user.id }
    });

    // We don't return the password
    const { password: _pw, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateUserProfile(userId: string, data: { name?: string; email?: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    const { password: _pw2, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  } catch (error) {
    return handleActionError(error);
  }
}
