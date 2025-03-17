import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { use, useEffect, useRef, useState } from 'react';
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
    
    useEffect(() => {
        setDraftName(draft.name);
        setSections(sectionss);
        setPersonalInfo(personalInfos);
        console.log("Draft Name:", sectionss);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Function to add a new section
    const handleAddSection = () => {
        const newSection = { header: '', description: '' };
        setSections([...sections, newSection]);
        setSelectedSectionIndex(sections.length); // Auto-select the new section
    };

    // Function to update section values
    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index][field] = value;
        setSections(updatedSections);
    };

    // Function to select a section on click
    const handleSectionClick = (index) => {
        setSelectedSectionIndex(index);
    };

    // Function to generate a PDF
    const handleGeneratePDF = () => {
        const input = document.getElementById('cv-preview');
        const scale = 3; // Higher scale for better image quality
        
        html2canvas(input, { 
            scale,
            useCORS: true,
            logging: true,
        }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions based on scale
            const pageContentHeight = 842; // Original CV container height in pixels
            const pageContentHeightScaled = pageContentHeight * scale;
            const totalHeight = canvas.height;
    
            // Calculate number of pages needed
            const numPages = Math.ceil(totalHeight / pageContentHeightScaled);
    
            for (let i = 0; i < numPages; i++) {
                if (i > 0) pdf.addPage();
                
                const startY = i * pageContentHeightScaled;
                const sliceHeight = Math.min(pageContentHeightScaled, totalHeight - startY);
    
                // Create temporary canvas for current page slice
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = sliceHeight;
    
                // Draw the page slice
                tempCtx.drawImage(
                    canvas,
                    0, startY,
                    canvas.width, sliceHeight,
                    0, 0,
                    canvas.width, sliceHeight
                );
    
                const imgData = tempCanvas.toDataURL('image/png');
                
                // Calculate dimensions for PDF
                const widthRatio = pageWidth / (canvas.width / scale);
                const imgWidth = pageWidth;
                const imgHeight = (sliceHeight / scale) * widthRatio;
    
                pdf.addImage(
                    imgData, 
                    'PNG', 
                    0, 0, 
                    imgWidth, 
                    Math.min(imgHeight, pageHeight) // Prevent overflow
                );
            }
    
            pdf.save('my-cv.pdf');
        });
    };

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
    };

    // Function to remove a section
    const handleRemoveSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
        setSelectedSectionIndex(null); // Reset selection
    };

    const handleSaveDraft = () => {
        axios.post('/save-draft', {
            personalInfo,
            sections,
            draftName,
            draftId: draft.id
        })
        .then(response => {
            console.log("Data successfully posted 11:", response.data);
            const createdDraft = response.data;
            setSections(createdDraft.sections);
            setPersonalInfo(createdDraft.personalInfo); 
            setDraftName(createdDraft.draft.name);

            // Show success banner
            setShowSuccessBanner(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setShowSuccessBanner(false);
            }, 5000);
        })
        .catch(error => {
            console.error("Error posting data:", error);
        });
    };

    const handleCloseBanner = () => {
        setShowSuccessBanner(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
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
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center gap-4 z-50 transition-all duration-300">
                    <span className="text-sm">Draft saved successfully!</span>
                    <button 
                        onClick={handleCloseBanner}
                        className="hover:bg-green-600 rounded-full h-6 w-6 flex items-center justify-center transition-colors"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex h-screen bg-gray-100">
                {/* Left Panel - Input Fields */}
                <div className="w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto">
                    {/* Draft Name Input and Save Button */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium">Draft Name</label>
                        <input
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter draft name"
                            required
                        />
                        <button
                            type='submit'
                            onClick={handleSaveDraft}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 w-full"
                        >
                            Save Draft
                        </button>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Build Your CV</h3>

                    {/* Personal Information */}
                    <div className="mb-6 space-y-3">
                        {['name', 'email', 'phone', 'address'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium capitalize">{field}</label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={personalInfo && personalInfo[field]}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Section Inputs */}
                    <div className="mb-6">
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
                    </div>

                    <button
                        onClick={handleAddSection}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-3"
                    >
                        Add Section
                    </button>

                    <button
                        onClick={handleGeneratePDF}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                    >
                        Generate PDF
                    </button>
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex-1 p-6 bg-gray-100 flex justify-center items-center">
                    <div 
                        id="cv-container" 
                        className="bg-white shadow-lg rounded-md relative" 
                        style={{ width: '595px', height: '842px', overflow: 'hidden' }}
                    >
                        {/* CV Preview */}
                        <div 
                            id="cv-preview" 
                            className="bg-white mx-auto p-10 overflow-hidden" 
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* Header Section */}
                            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
                                <h1 className="text-2xl font-bold">{personalInfo && personalInfo.name || "Your Name"}</h1>
                                <div className="flex justify-center gap-4 mt-2">
                                    <p className="text-gray-700">{personalInfo && personalInfo.email}</p>
                                    <p className="text-gray-700">{personalInfo && personalInfo.phone}</p>
                                    <p className="text-gray-700">{personalInfo && personalInfo.address}</p>
                                </div>
                            </div>

                            {/* Sections Preview */}
                            <div className="space-y-6">
                                {sections && sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer rounded-lg border-gray-300"
                                        onClick={() => handleSectionClick(index)}
                                    >
                                        <h2 className="text-xl font-bold mb-2 border-b-2 border-gray-800 pb-1">{section.header || "Section Title"}</h2>
                                        <div className="text-gray-700 leading-relaxed ql-editor" dangerouslySetInnerHTML={{ __html: section.description || "Section description..." }} />
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
