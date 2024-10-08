import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GanttChart from "@/Components/GanttChart/GanttChart";
import { Head } from "@inertiajs/react";

export default function Gantt({auth, tasks}) {
    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-100 leading-tight">
                    Gantt Chart
                </h2>
            </div>
        }>
        
            <Head title="Edit Task" />

            <GanttChart tasks={tasks} />
        </AuthenticatedLayout>
    )
}