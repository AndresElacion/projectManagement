import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants";
import Accordion from "@/Components/Accordion";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";

export default function Show({ auth, task, threads }) {
  const { data, setData, post, errors, reset } = useForm({
      description: "",
      image_path: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("task.threads.store", task.id), {
      onSuccess: () => reset(), // Clear the form after submission
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            {`Task "${task.name}"`}
          </h2>
          <Link
            href={route("task.edit", task.id)}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Edit
          </Link>
        </div>
      }
    >
      <Head title={`Task "${task.name}"`} />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              
              {/* Task Image */}
              <div>
                <img
                  src={task.image_path}
                  alt="Task Image"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Task Details */}
              <div className="p-6 text-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Section: Task Information */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-lg">Task ID:</label>
                      <p>{task.id}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Task Name:</label>
                      <p>{task.name}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Task Status:</label>
                      <p>
                        <span
                          className={
                            "px-3 py-1 rounded-full text-sm " +
                            TASK_STATUS_CLASS_MAP[task.status]
                          }
                        >
                          {TASK_STATUS_TEXT_MAP[task.status]}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Task Priority:</label>
                      <p>
                        <span
                          className={
                            "px-3 py-1 rounded-full text-sm " +
                            TASK_PRIORITY_CLASS_MAP[task.priority]
                          }
                        >
                          {TASK_PRIORITY_TEXT_MAP[task.priority]}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Created By:</label>
                      <p>{task.createdBy.name}</p>
                    </div>
                  </div>

                  {/* Right Section: Additional Information */}
                  <div className="pl-6 border-l border-gray-300">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-lg">Due Date:</label>
                      <p>{task.due_date}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Create Date:</label>
                      <p>{task.created_at}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Updated By:</label>
                      <p>{task.updatedBy.name}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Project:</label>
                      <p>
                        <Link
                          href={route("project.show", task.project.id)}
                          className="text-blue-500 hover:underline"
                        >
                          {task.project.name}
                        </Link>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <label className="font-bold text-lg">Assigned To:</label>
                      <p>{task.assignedUser.name}</p>
                    </div>
                  </div>
                </div>

                {/* Task Description */}
                <hr className="my-6 border-gray-300" />
                <div>
                  <label className="font-bold text-lg">Task Description:</label>
                  <p className="mt-2">{task.description}</p>
                </div>

                {/* Task Thread Section */}
                <hr className="my-6 border-gray-300" />
                <div>
                  <Accordion
                    title="Task Thread"
                    content={
                      <div>
                        {threads.data.length > 0 ? (
                          threads.data.map((thread) => (
                            <div
                              key={thread.id}
                              className="mb-6 p-4 rounded-lg shadow-lg"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-black font-bold text-lg">{thread.user.name}</h3>
                                <span className="text-black text-sm">
                                  Posted {thread.created_at}
                                </span>
                              </div>
                              <p className="text-sm text-black ">{thread.user.email}</p>
                              <p className="mt-2 text-black ">{thread.description}</p>
                              <div>
                                <img
                                  src={thread.image_path}
                                  alt="Task Image"
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No threads available.</p>
                        )}

                        {/* Add New Thread Form */}
                        <form onSubmit={onSubmit} className="mt-6">
                          <div className="mt-4">
                            <InputLabel
                            htmlFor="task_description"
                            value="Add a new thread"
                            />
                            <TextAreaInput
                              id="task_description"
                              name="description"
                              value={data.description}
                              className="mt-2 block w-full"
                              onChange={(e) => setData("description", e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                          </div>

                          <div className="mt-4">
                            <InputLabel
                                htmlFor="Thread_image_path"
                                value="Thread Image"
                            />
                            <TextInput
                                id="Thread_image_path"
                                type="file"
                                name="image_path"
                                className="mt-1 block w-full"
                                onChange={(e) => setData("image_path", e.target.files[0])}
                            />
                            <InputError message={errors.image_path} className="mt-2"/>
                          </div>
                          <button className="bg-emerald-500 py-2 px-4 text-white rounded-lg shadow-md hover:bg-emerald-600 mt-4">
                            Submit
                          </button>
                        </form>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

    </AuthenticatedLayout>
  );
}
