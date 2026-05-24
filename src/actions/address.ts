"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleActionError, AppError } from "@/lib/utils/errors";
import { addressSchema } from "@/lib/validations";

export async function createAddress(data: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const validatedData = addressSchema.parse(data);

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
    });

    return { success: true, data: address };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateAddress(addressId: string, data: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const validatedData = addressSchema.parse(data);

    const address = await prisma.address.update({
      where: { id: addressId, userId: session.user.id },
      data: validatedData,
    });

    return { success: true, data: address };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    await prisma.address.delete({
      where: { id: addressId, userId: session.user.id },
    });

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });

      await tx.address.update({
        where: { id: addressId, userId: session.user.id },
        data: { isDefault: true },
      });
    });

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
