import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Dashboard() {
    const [sections, setSections] = useState([
        { 
            description: "<ul><li><strong>Programming Languages:</strong> PHP, JavaScript, TypeScript, Python, SQL, HTML, CSS</li><li><strong>Web Development Frameworks &amp; Libraries:</strong> Laravel, React, Inertia.js, Tailwind CSS, Next.js</li><li><strong>Mobile Development:</strong> React Native, Firebase Cloud Messaging (FCM)</li><li><strong>Database Management:</strong> MySQL, PostgreSQL, SQLite, MongoDB</li></ul>",
            header: "Skills"
            },
            {
            description: "<ul><li><strong>Green Computing Lab Network Design</strong></li><li><strong>EWU Portal Replication using Laravel</strong></li><li><strong>CNN Model for Sugarcane Leaf Disease Classification</strong></li><li><strong>Exploratory Data Analysis on CBC Blood Test Dataset</strong></li><li><strong>SSL Certification Creation for Cybersecurity</strong></li></ul>",
            header: "Academic Projects"
            },
            { 
            description: "<ul><li><strong>Full Stack Developer - Respect Communication App</strong></li><li><strong>Software Developer - SUCSOM (Audit and Report Generation Dashboard)</strong></li><li><strong>Web Developer - Green Computing Lab (35 PCs)</strong></li><li><strong>Mobile Developer – Real-Time Chat Application</strong></li></ul>",
            header: "Experience"
            },
            { 
            description: "<ul><li><strong>BSc in CSE</strong> - East West University, Bangladesh <em>(Oct 2021 - June 2025)</em></li><li class=\"ql-indent-1\"><strong>CGPA: 3.92 / 4.00</strong> (Ongoing)</li><li><strong>Higher Secondary Certificate</strong> - Dhaka Board, Bangladesh <em>(June 2018 – June 2020)</em></li><li class=\"ql-indent-1\"><strong>GPA: 5.00 / 5.00</strong></li></ul>",
            header: "Education"
            }
    ]);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [personalInfo, setPersonalInfo] = useState({
        name: 'Akash Ahmed',
        email: 'akashahmed662001@gmail.com',
        phone: '01628351700',
        address: 'Uttara, Dhaka, 1230'
    });

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
        html2canvas(input, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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

            <div className="flex h-screen bg-gray-100">
                {/* Left Panel - Input Fields */}
                <div className="w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Build Your CV</h3>

                    {/* Personal Information */}
                    <div className="mb-6 space-y-3">
                        {['name', 'email', 'phone', 'address'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium capitalize">{field}</label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={personalInfo[field]}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Section Inputs */}
                    <div className="mb-6">
                        {sections.map((section, index) => (
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
                            className="mx-auto overflow-hidden bg-white shadow-lg rounded-md font-sans text-sm text-gray-800"
                            style={{ width: '100%', height: '100%', maxWidth: '800px' }}
                            >
                            {/* Header Section with Profile Picture and Details */}
                            <div className="pt-6 flex flex-col items-center">
                                <h1 className="text-2xl font-semibold mb-1">{personalInfo.name || "Your Name"}</h1>
                                <div className="flex space-x-4 text-xs text-gray-600">
                                <p>{personalInfo.address}</p>
                                <p>{personalInfo.phone}</p>
                                <p>{personalInfo.email}</p>
                                {/* Add LinkedIn and other links if needed */}
                                </div>
                            </div>

                            {/* Sections Preview */}
                            <div className="space-y-4 p-6">
                                {sections.map((section, index) => (
                                    <div
                                    key={index}
                                    className="rounded-md px-2"
                                    onClick={() => handleSectionClick(index)}
                                    >
                                    <div className="flex items-center mb-2">
                                        <h2 className="text-base font-semibold uppercase tracking-wide">
                                        {section.header || "Section Title"}
                                        </h2>
                                    </div>
                                    <div className="border-b-4 border-purple-800 mb-2 w-12"></div> {/* Purple underline */}
                                    <div 
                                        className="text-sm leading-relaxed ql-editor" 
                                        dangerouslySetInnerHTML={{ __html: section.description || "Section description..." }}
                                    />
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
