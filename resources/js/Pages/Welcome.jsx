import { Head, Link } from '@inertiajs/react';
import { Inertia } from "@inertiajs/inertia";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const templates = [
        { id: 1, name: 'ATLANTIC BLUE MULTI-COLUMN RESUME WITH SIDEBAR LEFT', description: 'A clean and minimal design.', image: '/assets/template1.png' },
        { id: 2, name: 'EXECUTIVE SERIF FONT BLACK AND WHITE RESUME TEMPLATE', description: 'A modern and creative layout.', image: '/assets/template1.png' },
        { id: 3, name: 'BLUE STEEL MINIMALISTIC RESUME CLASSIC', description: 'A professional style for corporate use.', image: '/assets/template1.png' },
        { id: 4, name: 'ROSEWOOD TWO-COLUMN RESUME TEMPLATE', description: 'A professional style for corporate use.', image: '/assets/template1.png' },
    ];

    const handleTemplateClick = (id) => {
        Inertia.get(`/create-cv/${id}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
            <Head title="Welcome" />

            <header className="bg-white/80 dark:bg-gray-800/80 p-4 shadow-md backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <svg
                            className="h-8 w-auto text-[#FF2D20]"
                            viewBox="0 0 62 65"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Your SVG content here */}
                        </svg>
                    </div>
                    <nav className="flex items-center">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white mr-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow relative flex items-center justify-center">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <div className="py-4">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-4 text-gray-900">
                                    <h3 className="text-lg font-semibold">Choose a Template</h3>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                onClick={() => handleTemplateClick(template.id)}
                                                className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer flex flex-col"
                                            >
                                                <img src={template.image} alt={template.name} className="w-full h-48 object-cover rounded-md mb-2" />
                                                <h4 className="font-bold text-xl">{template.name}</h4>
                                                <p className="text-gray-600 mt-2">{template.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-200/80 dark:bg-gray-700/80 p-4 text-center text-sm backdrop-blur-sm">
                Laravel v{laravelVersion} (PHP v{phpVersion})
            </footer>
        </div>
    );
}