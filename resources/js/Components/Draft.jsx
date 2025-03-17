import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

export default function Draft() {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    axios.get('/get-drafts')
      .then(response => {
        console.log("drafts", response.data.drafts);
        setDrafts(response.data.drafts);
      })
      .catch(error => console.error("Error fetching drafts:", error));
  }, []);

  const handleClick = (draft) => {
    Inertia.get(`/go-to-cv/${draft.templateId}/${draft.id}`);
  };

  return (
    <div className="mt-4">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="p-4 text-gray-900">
            <h3 className="text-lg font-semibold">Drafts</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer"
                  onClick={()=>handleClick(draft)}
                >
                  <h4 className="font-bold text-xl">{draft.name}</h4>
                  <p className="text-gray-600 mt-2">{draft.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
