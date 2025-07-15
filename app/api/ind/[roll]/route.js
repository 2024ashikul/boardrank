import prisma from "@/lib/prisma";

export async function GET(req, {params}) {
    const {roll }= params;
    try {
    const student = await prisma.student.findUnique({
      where: { roll_no: parseInt(roll) }, // or just roll if it's a string
    });

    if (!student) {
      return new Response(JSON.stringify({ error: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const studentSafe = {
      ...student,
      reg_no: student.reg_no.toString(), // handle BigInt
    };

    return new Response(JSON.stringify(studentSafe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


