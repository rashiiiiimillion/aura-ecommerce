"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { SectionType } from "@prisma/client";

export async function getHomepageSections() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return { success: true, data: sections };
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error);
    return { success: false, error: "Failed to fetch content" };
  }
}

export async function getAllHomepageSections() {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: sections };
  } catch (error) {
    console.error("Failed to fetch all homepage sections:", error);
    return { success: false, error: "Failed to fetch content" };
  }
}

export async function createHomepageSection(data: any) {
  try {
    const count = await prisma.homepageSection.count();
    
    const section = await prisma.homepageSection.create({
      data: {
        ...data,
        order: count,
      },
    });
    
    revalidateTag("homepage", "max");
    return { success: true, data: section };
  } catch (error) {
    console.error("Failed to create homepage section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateHomepageSection(id: string, data: any) {
  try {
    const section = await prisma.homepageSection.update({
      where: { id },
      data,
    });
    
    revalidateTag("homepage", "max");
    return { success: true, data: section };
  } catch (error) {
    console.error("Failed to update homepage section:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteHomepageSection(id: string) {
  try {
    await prisma.homepageSection.delete({
      where: { id },
    });
    
    revalidateTag("homepage", "max");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete homepage section:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

export async function reorderHomepageSections(updates: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.homepageSection.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );
    
    revalidateTag("homepage", "max");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder sections:", error);
    return { success: false, error: "Failed to reorder sections" };
  }
}
