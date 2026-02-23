import { prisma } from "./lib/prisma";
import app from "./app";

const PORT = process.env.PORT || 8000;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
    process.exit(1);
  }
}

main();
