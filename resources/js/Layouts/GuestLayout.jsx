import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-100 pb-12">
            <div>
                <Link href="/">
                    <img src="/img/logo.png" alt="" className="w-24" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
