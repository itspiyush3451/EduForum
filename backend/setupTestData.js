import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function setupTestData() {
  try {
    console.log("Setting up test data...");

    // Create departments first
    const departments = [
      {
        name: "Computer Science",
        description: "Computer Science and Engineering",
      },
      {
        name: "Information Technology",
        description: "Information Technology Department",
      },
      {
        name: "Electronics",
        description: "Electronics and Communication Engineering",
      },
      { name: "Mechanical", description: "Mechanical Engineering" },
      { name: "Civil", description: "Civil Engineering" },
    ];

    console.log("Creating departments...");
    for (const dept of departments) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      });
      console.log(`Created department: ${dept.name}`);
    }

    // Get the first department for the admin user
    const csDept = await prisma.department.findFirst({
      where: { name: "Computer Science" },
    });

    // Create test admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = {
      username: "admin",
      email: "admin@eduforum.com",
      password: hashedPassword,
      usertype: "ADMIN",
      departmentid: csDept.id,
    };

    await prisma.user.upsert({
      where: { email: adminUser.email },
      update: {},
      create: adminUser,
    });
    console.log("Created admin user: admin@eduforum.com / admin123");

    // Create test teacher user
    const teacherPassword = await bcrypt.hash("teacher123", 10);
    const teacherUser = {
      username: "teacher1",
      email: "teacher@eduforum.com",
      password: teacherPassword,
      usertype: "TEACHER",
      departmentid: csDept.id,
    };

    await prisma.user.upsert({
      where: { email: teacherUser.email },
      update: {},
      create: teacherUser,
    });
    console.log("Created teacher user: teacher@eduforum.com / teacher123");

    // Create test student user
    const studentPassword = await bcrypt.hash("student123", 10);
    const studentUser = {
      username: "student1",
      email: "student@eduforum.com",
      password: studentPassword,
      usertype: "STUDENT",
      departmentid: csDept.id,
    };

    await prisma.user.upsert({
      where: { email: studentUser.email },
      update: {},
      create: studentUser,
    });
    console.log("Created student user: student@eduforum.com / student123");

    console.log("\nTest data setup complete!");
    console.log("\nYou can now login with:");
    console.log("Admin: admin@eduforum.com / admin123");
    console.log("Teacher: teacher@eduforum.com / teacher123");
    console.log("Student: student@eduforum.com / student123");
  } catch (error) {
    console.error("Error setting up test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData();
