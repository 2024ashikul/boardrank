import Link from "next/link";
import prisma from "@/lib/prisma";

// Let Next.js generate pages on demand instead of pre-building everything
export const dynamicParams = true;

// Optional: you can pre-generate some pages if needed
export async function generateStaticParams() {
  // Only pre-generate first page for each institute if you want
  const institutes = await prisma.student.groupBy({ by: ["institute"] });
  return institutes.map(inst => ({
    ins: encodeURIComponent(inst.institute),
    page: "1",
  }));
}

export default async function Page({ params }) {
  const page = parseInt(params.page, 10) || 1;
  const institute = decodeURIComponent(params.ins);

  // Fetch students for this page
  const students = await prisma.student.findMany({
    where: { institute },
    take: 100,
    skip: (page - 1) * 100,
    orderBy: { sum: "desc" },
    select: {
      roll_no: true,
      name: true,
      gpa: true,
      institute: true,
      sum: true,
    },
  });

  // Check if there are more pages without expensive COUNT query
  const hasMore = students.length === 100;

  // Generate pagination (show up to 9 pages around current)
  let paginationList = [];
  for (let i = page; i < page + 9; i++) {
    if (!hasMore && i > page) break; // stop if no more pages
    paginationList.push(i);
  }

  return (
    <div className="px-4 py-6 flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Student List - {institute}
      </h1>

      {/* Pagination */}
      <div className="flex gap-2 mb-4">
        {page > 1 && (
          <Link
            href={`/ins/${encodeURIComponent(institute)}/page/${page - 1}`}
            className="px-3 py-1 bg-amber-200 rounded-sm"
          >
            Prev
          </Link>
        )}

        {paginationList.map(p => (
          <Link
            key={p}
            href={`/ins/${encodeURIComponent(institute)}/page/${p}`}
            className={`px-3 py-1 rounded-sm ${p === page ? "bg-amber-400" : "bg-amber-200"}`}
          >
            {p}
          </Link>
        ))}

        {hasMore && (
          <Link
            href={`/ins/${encodeURIComponent(institute)}/page/${page + 1}`}
            className="px-3 py-1 bg-amber-200 rounded-sm"
          >
            Next
          </Link>
        )}
      </div>

      {/* Student Table */}
      {students.length === 0 ? (
        <p className="text-center mt-10">No students found.</p>
      ) : (
        <table className="w-full max-w-[1200px] border border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-3 py-1 border">Rank</th>
              <th className="px-3 py-1 border">Roll No</th>
              <th className="px-3 py-1 border">Name</th>
              <th className="px-3 py-1 border">GPA</th>
              <th className="px-3 py-1 border">School</th>
              <th className="px-3 py-1 border">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
              const rank = (page - 1) * 100 + i + 1;
              return (
                <tr key={student.roll_no} className={rank % 2 === 0 ? "bg-green-200" : "bg-green-100"}>
                  <td className="px-3 py-1 border">{rank}</td>
                  <td className="px-3 py-1 border">{student.roll_no}</td>
                  <td className="px-3 py-1 border">
                    <Link href={`/ind/${student.roll_no}`} className="text-blue-600 underline">
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-3 py-1 border">{student.gpa}</td>
                  <td className="px-3 py-1 border">{student.institute}</td>
                  <td className="px-3 py-1 border">{student.sum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
