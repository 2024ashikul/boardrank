import Link from "next/link";
import prisma from "@/lib/prisma";

// Prevent any dynamic rendering fallback
export const dynamicParams = false;

export async function generateStaticParams() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Debug info: Running getStaticProps');
  }
  
  const institutes = await prisma.student.groupBy({
  by: ['institute'],
});

  const params = [];

  for (const inst of institutes) {
    const institute = inst.institute;

    // Count students for this institute
    const count = await prisma.student.count({
      where: { institute },
    });

    const totalPages = Math.ceil(count / 100);

    // Add all page params for this institute
    for (let i = 1; i <= totalPages; i++) {
      params.push({
        ins: institute,
        page: i.toString(),
      });
    }
  }

  return params;
}

export default async function Page({ params }) {
  const page = parseInt(params.page, 10) || 1;
  const institute = decodeURIComponent(params.ins);

  const students = await prisma.student.findMany({
    where: { institute },
    take: 100,
    skip: (page - 1) * 100,
    orderBy: { sum: "desc" },
  });

  const totalCount = await prisma.student.count({
    where: { institute },
  });

  const totalPages = Math.ceil(totalCount / 100);

  
  let paginationList = [];
  if (totalPages <= 10) {
    paginationList = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (page <= 5) {
    paginationList = Array.from({ length: 9 }, (_, i) => i + 1);
  } else if (totalPages - page <= 5) {
    paginationList = Array.from({ length: 9 }, (_, i) => totalPages - 8 + i);
  } else {
    paginationList = Array.from({ length: 9 }, (_, i) => page - 4 + i);
  }

  return (
    <>
      <div className="flex justify-center gap-3 mb-4">
        {page > 1 && (
          <Link
            href={`/ins/${encodeURIComponent(institute)}/page/${page - 1}`}
            className="bg-amber-200 px-4 py-1 rounded-sm"
          >
            Prev
          </Link>
        )}

        {paginationList.map((p) => (
          <Link
            key={p}
            href={`/ins/${encodeURIComponent(institute)}/page/${p}`}
            className={`px-4 py-1 rounded-sm ${
              p === page ? "bg-amber-400" : "bg-amber-200"
            }`}
          >
            {p}
          </Link>
        ))}

        {page < totalPages && (
          <Link
            href={`/ins/${encodeURIComponent(institute)}/page/${page + 1}`}
            className="bg-amber-200 px-4 py-1 rounded-sm"
          >
            Next
          </Link>
        )}
      </div>

      <div className="max-w-max mx-auto w-full">
        <h1 className="mb-4 text-center text-xl font-semibold">Student List - {institute}</h1>

        <table className="max-w-max mx-auto w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-1">Rank</th>
              <th className="border px-3 py-1">Roll No</th>
              <th className="border px-3 py-1">Name</th>
              <th className="border px-3 py-1">GPA</th>
              <th className="border px-3 py-1">School</th>
              <th className="border px-3 py-1">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
              const rank = (page - 1) * 100 + i + 1;
              return (
                <tr
                  key={student.roll_no}
                  className={rank % 2 === 0 ? "bg-green-200" : "bg-green-100"}
                >
                  <td className="border px-3 py-1">{rank}</td>
                  <td className="border px-3 py-1">{student.roll_no}</td>
                  <td className="border px-3 py-1">
                    <Link href={`/ind/${student.roll_no}`} className="text-blue-600 underline">
                      {student.name}
                    </Link>
                  </td>
                  <td className="border px-3 py-1">{student.gpa}</td>
                  <td className="border px-3 py-1">{student.institute}</td>
                  <td className="border px-3 py-1">{student.sum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
