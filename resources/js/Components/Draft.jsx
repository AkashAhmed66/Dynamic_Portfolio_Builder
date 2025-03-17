import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

export default function Draft() {
    const [drafts, setDrafts] = useState([]);
    const [showDeleteBanner, setShowDeleteBanner] = useState(false);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = () => {
        axios.get('/get-drafts')
            .then(response => {
                console.log("drafts", response.data.drafts);
                setDrafts(response.data.drafts);
            })
            .catch(error => console.error("Error fetching drafts:", error));
    };

    const handleClick = (draft) => {
        Inertia.get(`/go-to-cv/${draft.templateId}/${draft.id}`);
    };

    const handleDelete = (draftId) => {
        axios.delete(`/delete-draft/${draftId}`)
            .then(() => {
                fetchDrafts(); // Refresh the drafts after deletion
                setShowDeleteBanner(true); // Show the success banner
                setTimeout(() => setShowDeleteBanner(false), 3000); // Hide after 3 seconds
            })
            .catch(error => console.error("Error deleting draft:", error));
    };

    return (
        <div className="mt-4">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-4 text-gray-900">
                        <h3 className="text-lg font-semibold">Drafts</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {drafts.map((draft) => (
                                <div
                                    key={draft.id}
                                    className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer flex flex-col"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-xl">{draft.name}</h4>
                                        <button
                                            onClick={() => handleDelete(draft.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-gray-600 mb-2">{draft.description}</p>
                                    <button
                                        onClick={() => handleClick(draft)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteBanner && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center gap-4 z-50">
                    <span>Draft deleted successfully!</span>
                    <button
                        onClick={() => setShowDeleteBanner(false)}
                        className="hover:bg-red-600 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}