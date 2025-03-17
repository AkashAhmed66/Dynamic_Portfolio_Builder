import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { InlineMath, BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Dashboard() {
    const { draft, sectionss, personalInfos } = usePage().props;
    const [sections, setSections] = useState([]);
    const [personalInfo, setPersonalInfo] = useState({});
    const [draftName, setDraftName] = useState('');
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const timeoutRef = useRef(null);

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

    const LatexContent = ({ content }) => {
        const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
        const parts = content.split(regex);
    
        return (
            <div className="space-y-2">
                {parts.map((part, index) => {
                    if (!part) return null;
                    if (part.startsWith('$$') && part.endsWith('$$')) {
                        const math = part.slice(2, -2);
                        return <BlockMath key={index} math={math} />;
                    } else if (part.startsWith('$') && part.endsWith('$')) {
                        const math = part.slice(1, -1);
                        return <InlineMath key={index} math={math} />;
                    } else {
                        return <span key={index}>{part}</span>;
                    }
                })}
            </div>
        );
    };

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

    const generateLaTeXCode = () => {
        const header = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{hyperref}
\\usepackage[margin=1in]{geometry}

\\title{Curriculum Vitae}
\\author{${personalInfo.name || 'Your Name'}}
\\date{}

\\begin{document}

\\maketitle

\\section*{Contact Information}
\\begin{itemize}
    \\item Email: \\href{mailto:${personalInfo.email || ''}}{${personalInfo.email || ''}}
    \\item Phone: ${personalInfo.phone || ''}
    \\item Address: ${personalInfo.address || ''}
\\end{itemize}
`;

        const sectionsLatex = sections.map(section => `
\\section{${section.header || 'Section Title'}}
${section.description.replace(/\n/g, '\n') || 'Section content...'}
`).join('\n');

        const footer = `
\\end{document}
`;

        return header + sectionsLatex + footer;
    };

    const handleGeneratePDF = () => {
        const latexCode = generateLaTeXCode();
        
        axios.post('/generate-pdf', { latex: latexCode }, {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cv.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('PDF generation failed:', error);
            alert('PDF generation failed. Please check your LaTeX syntax.');
        });
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
                <div className="w-1/2 p-6 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="mb-6">
                        <input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                            placeholder="Draft Name"
                        />
                        <button 
                            onClick={handleSaveDraft}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
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

                    {sections.map((section, index) => (
                        <div key={index} className="p-3 mb-4 border rounded-lg border-gray-300 relative">
                            <label className="block text-sm font-medium mb-1">Section Header</label>
                            <input
                                type="text"
                                value={section.header}
                                onChange={(e) => handleSectionChange(index, 'header', e.target.value)}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <label className="block text-sm font-medium mb-1">Description (LaTeX)</label>
                            <textarea
                                value={section.description}
                                onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded h-32"
                                placeholder="Enter LaTeX content (e.g., $E=mc^2$)..."
                            />
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                <LatexContent content={section.description} />
                            </div>
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
                        Download PDF File
                    </button>
                </div>

                {/* Right Panel - LaTeX Preview */}
                <div className="w-1/2 p-6 bg-gray-100 overflow-y-auto">
                    <SyntaxHighlighter 
                        language="latex" 
                        style={vscDarkPlus}
                        className="p-6 rounded shadow-lg"
                        wrapLines={true}
                    >
                        {generateLaTeXCode()}
                    </SyntaxHighlighter>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}