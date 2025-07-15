import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const students = await prisma.student.findMany()
        console.log(students)
        const studentsSafe = students.map(student => ({
            ...student,
            reg_no: student.reg_no.toString()
        }));

        return new Response(JSON.stringify(studentsSafe), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch students' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}