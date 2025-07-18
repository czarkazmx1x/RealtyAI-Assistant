
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logActivity = async (type, details) => {
  try {
    await prisma.activityLog.create({
      data: {
        type,
        details,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
