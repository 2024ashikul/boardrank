import prisma from "@/lib/prisma"


export default async function Individual({ params }) {

    const roll = parseInt(await params.roll);
    const student = await prisma.student.findUnique({
        where: {
            roll_no: roll
        }
    })
    console.log(student);


    const subjectMarks = Object.fromEntries(
        Object.entries(student).filter(([key, val]) =>
            typeof val === 'number' && key !== 'gpa' && key !== 'roll_no' && key !== 'sum' && val != null
        ));
    console.log(subjectMarks)

    return (
        <>
            <div className="flex flex-col justify-center gap-8">
                <table className="table-auto mx-16 justify-center">
                    <caption className="text-2xl my-4">General Information</caption>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{student?.name}</td>
                        </tr>
                        <tr>
                            <td>Father Name</td>
                            <td>{student.father_name}</td>
                        </tr>
                        <tr>
                            <td>Mother Name</td>
                            <td>{student.mother_name}</td>
                        </tr>
                        <tr>
                            <td>Roll</td>
                            <td>{student.roll_no}</td>
                        </tr>
                        <tr>
                            <td>Registration No</td>
                            <td>{student.reg_no}</td>
                        </tr>
                    </tbody>
                </table>
                
                <table className="w-max-w table-auto mx-16 justify-center ">
                    <caption className="text-2xl my-4">Detailed Marks</caption>

                    <tbody>
                        <tr className="px-4 border bg-green-500 ">
                            <td className="py-1 px-4 capitalize" >Subject</td>
                            <td>Marks</td>
                        </tr>
                        {Object.entries(subjectMarks).map(([subject, mark], index) => (
                            <tr className="px-4 border" key={index}>
                                <td className="py-1 px-4 capitalize">
                                    {subject.replace(/_/g, ' ').toUpperCase()}
                                </td>
                                <td>
                                    {mark}
                                </td>
                            </tr>
                        ))}
                        <tr className="px-4 border bg-green-500">
                            <td className="py-1 px-4 capitalize" >Total</td>
                            <td>{student.sum}</td>
                        </tr>
                    </tbody>

                </table>
            </div>

        </>
    )
}
