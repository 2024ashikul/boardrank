import NavBar from "@/components/NavBar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page({ params }) {
  let { filter, search: rawSearch, page } = params;
  const search = decodeURIComponent(rawSearch);
  page = parseInt(page) || 1;

  let query = {};

  // Roll number exact match
  if (filter === "roll") {
    query.roll_no = parseInt(search);
  } else {
    // Partial match search using trigram index
    query[filter] = {
      contains: search,
      mode: "insensitive" // Prisma ILIKE
    };
  }

  // Fetch only necessary fields
  const students = await prisma.student.findMany({
    select: {
      roll_no: true,
      name: true,
      gpa: true,
      institute: true,
      sum: true
    },
    where: query,
    take: 100,
    skip: (page - 1) * 100,
    orderBy: { sum: "desc" }
  });

  // Approximate pagination: skip counting total rows
  // For large datasets, avoid prisma.student.count()
  const hasMore = students.length === 100;

  // Generate pagination list (max 10 pages)
  const paginationList = [];
  const maxPage = page + 9;
  for (let i = page; i <= maxPage; i++) paginationList.push(i);

  return (
    <>
      {students.length === 0 ? (
        <p className="text-center mt-10">No student found</p>
      ) : (
        <>
          <div className="flex justify-center gap-3 my-4">
            {page > 1 && (
              <div className="bg-amber-200 px-4 py-1 rounded-sm">
                <Link href={`/page/${page - 1}`}>Prev</Link>
              </div>
            )}
            {paginationList.map((p) => (
              <div key={p} className="bg-amber-200 px-4 py-1 rounded-sm">
                <Link href={`/page/${p}`}>{p}</Link>
              </div>
            ))}
            {hasMore && (
              <div className="bg-amber-200 px-4 py-1 rounded-sm">
                <Link href={`/page/${page + 1}`}>Next</Link>
              </div>
            )}
          </div>

          <div className="max-w-max m-auto w-full">
            <h1 className="text-center text-xl mb-4">Student List</h1>
            <table className="max-w-max m-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-5 py-2">Rank</th>
                  <th className="px-5 py-2">Roll No</th>
                  <th className="px-5 py-2">Name</th>
                  <th className="px-5 py-2">GPA</th>
                  <th className="px-5 py-2">School</th>
                  <th className="px-5 py-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => {
                  const rank = (page - 1) * 100 + i + 1;
                  return (
                    <tr
                      key={student.roll_no}
                      className={`h-12 ${rank % 2 === 0 ? "bg-green-500" : "bg-green-400"}`}
                    >
                      <td className="px-5">{rank}</td>
                      <td className="px-5">{student.roll_no}</td>
                      <td className="px-5">
                        <Link href={`/ind/${student.roll_no}`}>{student.name}</Link>
                      </td>
                      <td className="px-5">{student.gpa}</td>
                      <td className="px-5">
                        <Link href={`/ins/${encodeURIComponent(student.institute)}/page/1`}>
                          {student.institute}
                        </Link>
                      </td>
                      <td className="px-5">{student.sum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
