import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { draft, sectionss, personalInfos } = usePage().props;
    const [sections, setSections] = useState([]);
    const [personalInfo, setPersonalInfo] = useState({});
    const [draftName, setDraftName] = useState(''); // New state for draft name
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const timeoutRef = useRef(null);
    const sectionRefs = useRef([]);
    const PAGE_HEIGHT = 842; // A4 height in pixels
    const PAGE_WIDTH = 595;  // A4 width in pixels
    const HEADER_HEIGHT = 160;

    useEffect(() => {
        setDraftName(draft?.name || '');
        setPersonalInfo(personalInfos || {});
        setSections(sectionss || []);
    }, []);
    
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const calculatePages = () => {
        const pages = [];
        let currentPage = [];
        let currentHeight = 0;
        let availableHeight = PAGE_HEIGHT - HEADER_HEIGHT;

        sections.forEach((section, index) => {
            const sectionHeight = sectionRefs.current[index]?.offsetHeight || 0;
            
            if (sectionHeight > PAGE_HEIGHT) {
                // Handle extra tall sections
                pages.push([section]);
                currentPage = [];
                currentHeight = 0;
                availableHeight = PAGE_HEIGHT;
                return;
            }

            if (currentHeight + sectionHeight > availableHeight) {
                pages.push(currentPage);
                currentPage = [section];
                currentHeight = sectionHeight;
                availableHeight = PAGE_HEIGHT;
            } else {
                currentPage.push(section);
                currentHeight += sectionHeight;
            }
        });

        if (currentPage.length > 0) pages.push(currentPage);
        return pages;
    };

    const pages = calculatePages();

    const handleAddSection = () => {
        const newSection = { header: '', description: '' };
        setSections([...sections, newSection]);
    };

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index][field] = value;
        setSections(updatedSections);
    };

    const handleRemoveSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const handleGeneratePDF = async () => {
        const pdf = new jsPDF('p', 'px', [PAGE_WIDTH, PAGE_HEIGHT]);
        const scale = 2;

        for (let i = 0; i < pages.length; i++) {
            const pageContent = document.getElementById(`page-${i}`);
            const canvas = await html2canvas(pageContent, {
                scale,
                useCORS: true,
                windowWidth: PAGE_WIDTH,
                windowHeight: PAGE_HEIGHT,
                logging: true
            });

            const imgData = canvas.toDataURL('image/png');
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        }

        pdf.save('cv.pdf');
    };

    const handleSaveDraft = () => {
        axios.post('/save-draft', {
            personalInfo,
            sections,
            draftName,
            draftId: draft?.id
        }).then(() => {
            setShowSuccessBanner(true);
            timeoutRef.current = setTimeout(() => setShowSuccessBanner(false), 5000);
        }).catch(console.error);
    };

    const quillModules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            [{ 'direction': 'rtl' }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {showSuccessBanner && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center gap-4 z-50">
                    <span>Draft saved successfully!</span>
                    <button 
                        onClick={() => setShowSuccessBanner(false)} 
                        className="hover:bg-green-600 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex h-screen bg-gray-100">
                {/* Left Panel - Editor */}
                <div className="w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="mb-6">
                        <input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                            placeholder="Draft Name"
                        />
                        <button 
                            onClick={handleSaveDraft}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Draft
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {['name', 'email', 'phone', 'address'].map((field) => (
                            <input
                                key={field}
                                value={personalInfo[field] || ''}
                                onChange={(e) => setPersonalInfo({...personalInfo, [field]: e.target.value})}
                                className="w-full p-2 border rounded"
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            />
                        ))}
                    </div>

                    {sections && sections.map((section, index) => (
                        <div key={index} className="p-3 mb-4 border rounded-lg border-gray-300 relative">
                            <label className="block text-sm font-medium mb-1">Section Header</label>
                            <input
                                type="text"
                                value={section.header}
                                onChange={(e) => handleSectionChange(index, 'header', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <label className="block text-sm font-medium mt-3 mb-1">Description</label>
                            <div className="h-40 max-h-40 overflow-scroll">
                                <ReactQuill
                                    theme="snow"
                                    value={section.description}
                                    onChange={(value) => handleSectionChange(index, 'description', value)}
                                    modules={quillModules}
                                    className="h-full"
                                />
                            </div>

                            {/* Remove Section Button */}
                            <button
                                onClick={() => handleRemoveSection(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={handleAddSection}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Add New Section
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Generate PDF
                    </button>
                </div>

                {/* Right Panel - Preview */}
                <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                    <div className="space-y-6">
                        {pages.map((pageSections, pageIndex) => (
                            <div 
                                key={pageIndex}
                                id={`page-${pageIndex}`}
                                className="bg-white mx-auto p-10 shadow-lg relative"
                                style={{ 
                                    width: PAGE_WIDTH, 
                                    height: PAGE_HEIGHT,
                                    minHeight: PAGE_HEIGHT
                                }}
                            >
                                {pageIndex === 0 && (
                                    <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                                        <h1 className="text-3xl font-bold mb-2">
                                            {personalInfo.name || 'Your Name'}
                                        </h1>
                                        <div className="flex justify-center gap-4 text-gray-600">
                                            {personalInfo.email && <p>{personalInfo.email}</p>}
                                            {personalInfo.phone && <p>{personalInfo.phone}</p>}
                                            {personalInfo.address && <p>{personalInfo.address}</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {pageSections.map((section, index) => (
                                        <div 
                                            key={index}
                                            ref={el => sectionRefs.current[index] = el}
                                            className="cv-section"
                                        >
                                            <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-2">
                                                {section.header || 'Section Title'}
                                            </h2>
                                            <div 
                                                className="ql-editor text-gray-700" 
                                                dangerouslySetInnerHTML={{ __html: section.description || 'Section content...' }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Fill remaining space on page */}
                                {pageIndex !== 0 && pageSections.length > 0 && (
                                    <div style={{
                                        height: PAGE_HEIGHT - Array.from(document.querySelectorAll('.cv-section'))
                                            .reduce((acc, el) => acc + el.offsetHeight, 0) - 40
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}