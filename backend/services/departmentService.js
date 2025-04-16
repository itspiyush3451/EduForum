import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
// Input validation schema
const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Department name must be at least 2 characters" })
    .max(50, { message: "Department name cannot exceed 50 characters" })
    .trim(),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
});
//  Create a new department

export async function createDepartment(data) {
  try {
    // Validate input using the schema
    const validatedData = departmentSchema.parse(data);
    
    // Check if department with same name already exists
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive' // Case-insensitive comparison
        }
      }
    });

    if (existingDepartment) {
      return {
        success: false,
        message: "A department with this name already exists"
      };
    }

    // Create the department
    const department = await prisma.department.create({
      data: {
        name: validatedData.name,
        description: validatedData.description
      }
    });

    return {
      success: true,
      message: "Department created successfully",
      data: department
    };
  } catch (error) {
    console.error("Error in createDepartment service:", error);
    if (error.name === 'ZodError') {
      return {
        success: false,
        message: "Invalid department data",
        errors: error.errors
      };
    }
    throw error;
  }
}

//  Get all departments

export async function getAllDepartments() {
  try {
    const departments = await prisma.department.findMany({
      select: {
        departmentid: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return {
      success: true,
      data: departments,
      message: "Departments retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      success: false,
      message: "Error fetching departments",
      data: [],
    };
  }
}

//  Get a single department by ID

export async function getDepartmentById(departmentid) {
  try {
    const department = await prisma.department.findUnique({
      where: { departmentid }, // Change 'id' to 'departmentid'
    });
    if (!department) {
      return { success: false, message: "Department not found" };
    }
    return { success: true, data: department };
  } catch (error) {
    console.error("Error fetching department:", error);
    return { success: false, message: "Error fetching department" };
  }
}

// Update department name
export async function updateDepartment(id, name) {
  try {
    const validatedData = departmentSchema.parse({ name });

    // Check if department exists before updating
    const existingDepartment = await prisma.department.findUnique({
      where: { departmentid: id },
    });

    if (!existingDepartment) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    // Check if new name is already in use by another department
    const duplicateDepartment = await prisma.department.findUnique({
      where: { name: validatedData.name },
    });

    if (duplicateDepartment && duplicateDepartment.departmentid !== id) {
      return {
        success: false,
        message: "Department name must be unique",
      };
    }

    const department = await prisma.department.update({
      where: { departmentid: id },
      data: { name: validatedData.name },
    });

    return {
      success: true,
      data: department,
      message: "Department updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Error updating department:", {
      error: error.message,
      code: error.code,
      departmentId: id,
    });

    return {
      success: false,
      message: "Error updating department",
    };
  }
}
//   Delete a department
export async function deleteDepartment(id) {
  try {
    // First, check if the department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { departmentid: id },
      select: { departmentid: true, name: true },
    });

    if (!existingDepartment) {
      return {
        success: false,
        message: "Department not found",
      };
    }

    // Check if department has any associated users
    const usersInDepartment = await prisma.user.count({
      where: { departmentid: id },
    });

    if (usersInDepartment > 0) {
      return {
        success: false,
        message: "Cannot delete department with associated users",
      };
    }

    // Proceed with deletion
    await prisma.department.delete({
      where: { departmentid: id },
    });

    return {
      success: true,
      message: "Department deleted successfully",
      data: {
        departmentid: existingDepartment.departmentid,
        name: existingDepartment.name,
      },
    };
  } catch (error) {
    console.error("Error deleting department:", {
      error: error.message,
      code: error.code,
      departmentId: id,
    });

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        message: "Department not found",
      };
    }

    return {
      success: false,
      message: "Error deleting department",
    };
  }
}
