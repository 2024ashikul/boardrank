import prisma from "@/lib/prisma";
import React from "react";
import Link from "next/link";


export async function generateStaticParams() {
  const students = await prisma.student.findMany({
    select: { roll_no: true },
  });

  return students.map((student) => ({
    roll: student.roll_no.toString(),
  }));
}


export default async function Individual({ params }) {
  const roll = parseInt(params.roll, 10);

  const student = await prisma.student.findUnique({
    where: { roll_no: roll },
  });

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold">Student not found</h2>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const subjectMarks = Object.fromEntries(
    Object.entries(student).filter(
      ([key, val]) =>
        typeof val === "number" &&
        key !== "gpa" &&
        key !== "roll_no" &&
        key !== "sum" &&
        val !== null
    )
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Student Details – Roll {student.roll_no}
      </h1>

      
      <table className="w-full border mb-8">
        <caption className="text-xl font-semibold my-2">General Information</caption>
        <tbody>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Name</td>
            <td className="p-2">{student.name}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Father's Name</td>
            <td className="p-2">{student.father_name}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Mother's Name</td>
            <td className="p-2">{student.mother_name}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Roll No</td>
            <td className="p-2">{student.roll_no}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Registration No</td>
            <td className="p-2">{student.reg_no}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Institute</td>
            <td className="p-2">
              <Link
                href={`/ins/${encodeURIComponent(student.institute)}/page/1`}
                className="text-blue-600 underline"
              >
                {student.institute}
              </Link>
            </td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">GPA</td>
            <td className="p-2">{student.gpa}</td>
          </tr>
          <tr className="even:bg-green-50">
            <td className="p-2 font-semibold">Total Marks</td>
            <td className="p-2">{student.sum}</td>
          </tr>
        </tbody>
      </table>

      
      <table className="w-full border">
        <caption className="text-xl font-semibold my-2">Subject Marks</caption>
        <thead>
          <tr className="bg-green-200">
            <th className="p-2 text-left">Subject</th>
            <th className="p-2 text-left">Marks</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(subjectMarks).map(([subject, mark], index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-green-50" : "bg-green-100"}>
              <td className="p-2">{subject.replace(/_/g, " ").toUpperCase()}</td>
              <td className="p-2">{mark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <Link href="/" className="px-4 py-2 bg-amber-300 rounded hover:bg-amber-400">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
