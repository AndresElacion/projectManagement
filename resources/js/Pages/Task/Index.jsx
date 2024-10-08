
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import TaskTable from "./TaskTable";

export default function Index({auth, tasks, success, queryParams = null}) {

    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Tasks
                    </h2>
                    <Link href={route("task.create")} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">Add New</Link>
                </div>    
            }
        
        >
            
            <Head title="Tasks" />
            
            <div className="py-12">
                <div className="container mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border rounded-lg shadow-lg text-gray-900">
                            <TaskTable tasks={tasks} queryParams={queryParams} success={success} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}