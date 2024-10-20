import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="text-gray-700">
                <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <div className="relative w-full">
                        
                        {/* Navigation */}
                        <nav className="flex justify-end py-6 px-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="ml-4 px-4 py-2 text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Hero Section */}
                        <main className="mt-12 lg:mt-20 text-left">
                            <section className="container mx-auto flex flex-col lg:flex-row items-center lg:space-x-12">
                                {/* Content Section */}
                                <div className="lg:w-1/2">
                                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight md:text-7xl">
                                        Take Charge of Your Workflow with TaskFlow
                                    </h1>
                                    <p className="mt-6 text-xl text-gray-600 max-w-lg">
                                        Supercharge your team’s productivity by managing tasks, tracking progress, and collaborating effortlessly to hit every deadline. Simplify your project planning with TaskFlow.
                                    </p>
                                    <div className="mt-8 flex space-x-4">
                                        <a
                                        href={route('register')}
                                        className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 text-base font-semibold"
                                        >
                                        Start Your Free Trial
                                        </a>
                                        <a
                                        href="#features"
                                        className="px-6 py-3 text-blue-600 bg-transparent border border-blue-600 rounded-lg shadow-lg hover:bg-blue-100 transform hover:scale-105 transition duration-300 text-base font-semibold"
                                        >
                                        Explore Features
                                        </a>
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-end">
                                <img
                                    className=" max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300"
                                    src="/img/Hero.png"
                                    alt="TaskFlow Dashboard"
                                />
                                </div>
                            </section>
                        </main>                        

                        {/* Goodbye to Old Tradition Section */}
                        <section className="mt-20 py-20 bg-slate-50 rounded-lg">
                            <div className="container mx-auto px-6 lg:px-12 text-center">
                                <h2 className="text-4xl font-extrabold text-gray-900">
                                    Say Goodbye to the Old Tradition of Project Management
                                </h2>
                                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                    Embrace a new era of project management with TaskFlow. No more endless email chains or outdated spreadsheets. Our platform integrates modern methodologies, providing a seamless and intuitive experience for managing your projects. Say goodbye to chaos and hello to clarity, collaboration, and control.
                                </p>
                            </div>
                        </section>

                        {/* Optimize Project Planning with Interactive Gantt Charts */}
                        <section className="mt-20 py-20 bg-slate-50 rounded-lg">
                            <div className="container mx-auto px-6 lg:px-12 text-center">
                                <h2 className="text-4xl font-extrabold text-gray-900">
                                    Optimize Project Planning with Interactive Gantt Charts
                                </h2>
                                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                    Effortlessly manage timelines, set milestones, and track progress using our dynamic Gantt charts. Stay on top of every task, from start to finish, and monitor dependencies and progress in real-time. With simple drag-and-drop functionality, adjusting task schedules has never been easier. Whether you're managing a single project or multiple ones, TaskFlow helps you see the big picture and ensures you hit your goals on time and with precision!
                                </p>
                            </div>
                        </section>

                        {/* CTA */}
                        <footer className="bg-blue-600 text-white py-16 mt-24 rounded-lg shadow-md mb-12">
                            <div className="w-full text-center">
                                <h2 className="text-4xl font-extrabold mb-4">
                                    Start using TaskFlow today and watch your productivity soar!
                                </h2>
                                <a
                                    href={route('register')}
                                    className="px-6 py-3 text-white bg-amber-600 rounded-lg shadow-lg hover:bg-amber-500 transform hover:scale-105 transition duration-300 text-base font-semibold"
                                    >
                                    Start Your Free Trial
                                </a>
                            </div>
                        </footer>

                        {/* Key Features Section */}
                        <section className="mt-20 py-20 bg-slate-50">
                            <div className="container mx-auto px-6 lg:px-12">
                                <h2 className="text-4xl font-extrabold text-center text-gray-900">
                                    TaskFlows Tailored for Your Team
                                </h2>
                                <p className="mt-4 text-lg text-center text-gray-600 max-w-3xl mx-auto">
                                    TaskFlow comes with features designed to streamline project management, from assigning tasks to tracking team progress. Take control of your projects and drive results.
                                </p>

                                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Task Management
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Assign, track, and manage tasks with ease. Ensure every team member knows their responsibilities and deadlines.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Team Collaboration
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Foster real-time collaboration with built-in messaging, file sharing, and centralized communication tools.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Deadline Tracking
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Stay ahead of deadlines with real-time notifications and detailed tracking for each project milestone.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Project Analytics
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Get insights into your projects with comprehensive analytics to make data-driven decisions that enhance productivity.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Time Tracking
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Keep track of time spent on tasks to ensure projects stay within budget and deadlines.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-lg rounded-lg shadow-md transform hover:scale-105 transition duration-300 p-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Custom Workflows
                                        </h3>
                                        <p className="mt-4 text-gray-600">
                                            Create workflows that align with your team's processes. TaskFlow adapts to how you work best.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="bg-gray-900 text-white py-16 mt-24 rounded-t-lg shadow-md">
                            <div className="w-full text-center">
                                <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}




