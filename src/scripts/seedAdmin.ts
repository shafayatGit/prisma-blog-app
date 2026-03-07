import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    // ? Step 1 : Make admin data
    const adminData = {
      name: `${process.env.ADMIN_NAME}`,
      email: `${process.env.ADMIN_EMAIL}`,
      role: UserRole.ADMIN,
      password: `${process.env.ADMIN_PASS}`,
    };
    console.log(adminData);

    //?step 2: Checking the user is already available or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("user aleary exists");
    }

    //?Step 3: if not then POST admin data as like we signup any user
    const signUpAdmin = await fetch(
      "http://localhost:8000/api/auth/sign-up/email",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000", // mustttttt have to give the originn!!!!!!!!
        },
        body: JSON.stringify(adminData),
      },
    );
    //console.log(signUpAdmin);

    //? Step 4: If the admin is created then updated the emailVerification
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    console.log("Updated");
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
