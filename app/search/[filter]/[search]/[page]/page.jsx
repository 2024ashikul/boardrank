

import NavBar from "@/components/NavBar";
import prisma from "@/lib/prisma";
import Link from "next/link";



export default async function Page({ params }) {
  
  let filter = params.filter;
  let search = decodeURIComponent(params.search);
  const page = params.page;

  let query = {
    [filter]: {

      contains: search
    },
  }


  if (filter == 'roll') {
    filter = 'roll_no';
    search = parseInt(search);
    query = {
      [filter]: {
        equals: search
      },
    }
  }



  const students = await prisma.student.findMany({
    take: 100,
    skip: (page - 1) * 100,
    orderBy: {
      sum: 'desc'
    },
    where: query

  });


  const temp = await prisma.student.count({
    where: query
  });
  const count = Math.floor(temp / 100)

  const paginationList = [];
  if (count <= 10) {
    for (let i = 1; i <= count; i++) paginationList.push(i);
  } else if (page <= 5) {
    for (let i = 1; i <= 9; i++) paginationList.push(i);
  } else if (count - page <= 5) {
    for (let i = count; i >= count - 9; i--) paginationList.push(i);
  } else {
    for (let i = page - 4; i <= page + 4; i++) paginationList.push(i);
  }
  paginationList.sort((a, b) => a - b);

  console.log(students);

  console.log(count);

  return (
    <>
      
      {students.length === 0 ? 'No student found' :


        <>
          <div className="flex justify-center gap-3 ">
            <div className="bg-amber-200 px-4 py-1 rounded-sm"><Link href={`/page/${page - 1}`}>Prev</Link></div>
            {paginationList.map((page, index) => (
              <div key={index} className="bg-amber-200 px-4 py-1 rounded-sm"><Link href={`/page/${page}`}>{page}</Link></div>
            ))}
            <div className="bg-amber-200 px-4 py-1 rounded-sm"><Link href={`/page/${page + 1}`}>Next</Link></div>
          </div>
          <div className="max-w-max m-auto w-full">
            <h1>Student List</h1>
            <table className="max-w-max m-auto w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>GPA</th>
                  <th>School</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => {
                  const rank = (page - 1) * 100 + 1;
                  return (
                    <tr key={student.roll_no} className={`${(rank + i) % 2 == 0 ? 'bg-green-500' : 'bg-green-400'} h-12`}>
                      <td className="px-5">{rank + i}</td>
                      <td className="px-5">{student.roll_no}</td>
                      <td className="px-5"> <Link href={`/ind/${student.roll_no}`}>{student.name}</Link></td>
                      <td className="px-5">{student.gpa}</td>
                      <td className="px-5"><Link href={`/ins/${encodeURIComponent(student.institute)}/page/1`}>{student.institute}</Link></td>
                      <td className="px-5">{student.sum}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      }
    </>
  );
}
