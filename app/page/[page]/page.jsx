import Link from "next/link";
import prisma from "@/lib/prisma";
import React from "react";

export async function generateStaticParams() {
  const totalCount = await prisma.student.count();
  const totalPages = Math.ceil(totalCount / 100);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}


export default async function Page({ params }) {
  const page = parseInt(params.page, 10) || 1;

  const students = await prisma.student.findMany({
    take: 100,
    skip: (page - 1) * 100,
    orderBy: { sum: "desc" },
  });

  const totalCount = await prisma.student.count();
  const totalPages = Math.ceil(totalCount / 100);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Rankings – Page {page}</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Rank</th>
            <th className="p-2">Roll No</th>
            <th className="p-2">Name</th>
            <th className="p-2">GPA</th>
            <th className="p-2">School</th>
            <th className="p-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, i) => {
            const rank = (page - 1) * 100 + i + 1;
            return (
              <tr key={student.roll_no} className={rank % 2 === 0 ? 'bg-green-100' : 'bg-green-50'}>
                <td className="p-2">{rank}</td>
                <td className="p-2">{student.roll_no}</td>
                <td className="p-2">
                  <Link href={`/ind/${student.roll_no}`} className="text-blue-600 underline">
                    {student.name}
                  </Link>
                </td>
                <td className="p-2">{student.gpa}</td>
                <td className="p-2">
                  <Link href={`/ins/${encodeURIComponent(student.institute)}/page/1`} className="text-blue-600 underline">
                    {student.institute}
                  </Link>
                </td>
                <td className="p-2">{student.sum}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {page > 1 && (
          <Link href={`/page/${page - 1}`} className="px-3 py-1 bg-amber-200 rounded-sm">
            Prev
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 3)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const showEllipsis = prev && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && <span className="px-2">...</span>}
                <Link
                  href={`/page/${p}`}
                  className={`px-3 py-1 rounded-sm ${p === page ? 'bg-amber-400' : 'bg-amber-200'}`}
                >
                  {p}
                </Link>
              </React.Fragment>
            );
          })}

        {page < totalPages && (
          <Link href={`/page/${page + 1}`} className="px-3 py-1 bg-amber-200 rounded-sm">
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
