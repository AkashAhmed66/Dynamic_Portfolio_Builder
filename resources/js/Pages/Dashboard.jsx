import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from "@inertiajs/inertia";
import Draft from '@/Components/Draft';

export default function Dashboard() {
    const templates = [
        { id: 1, name: 'Template 1', description: 'A clean and minimal design.' },
        { id: 2, name: 'Template 2', description: 'A modern and creative layout.' },
        { id: 3, name: 'Template 3', description: 'A professional style for corporate use.' },
        { id: 4, name: 'Template 4', description: 'A professional style for corporate use.' },
        // { id: 5, name: 'Template 5', description: 'A professional style for corporate use.' },
    ];

    const handleTemplateClick = (id) => {
        Inertia.get(`/create-cv/${id}`);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <Draft />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 text-gray-900">
                        <h3 className="text-lg font-semibold">Choose a Template</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => handleTemplateClick(template.id)}
                                        className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer"
                                    >
                                        <h4 className="font-bold text-xl">{template.name}</h4>
                                        <p className="text-gray-600 mt-2">{template.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
