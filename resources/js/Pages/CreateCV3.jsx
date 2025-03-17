import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { InlineMath, BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Dashboard() {
    const { draft, sectionss, personalInfos } = usePage().props;
    const [sections, setSections] = useState([]);
    const [personalInfo, setPersonalInfo] = useState({});
    const [draftName, setDraftName] = useState('');
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const timeoutRef = useRef(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [finalLatexCode, setLatexCode] = useState('');

    useEffect(() => {
        setDraftName(draft?.name || '');
        setPersonalInfo(personalInfos || {});
        setSections(sectionss || []);
        setLatexCode(generateLaTeXCode());
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const htmlToLatex = (html) => {
        let latex = html;
    
        // Convert Bold text
        latex = latex.replace(/<strong>(.*?)<\/strong>/g, '\\textbf{$1}');
        latex = latex.replace(/<b>(.*?)<\/b>/g, '\\textbf{$1}');
    
        // Convert Italic text
        latex = latex.replace(/<em>(.*?)<\/em>/g, '\\textit{$1}');
        latex = latex.replace(/<i>(.*?)<\/i>/g, '\\textit{$1}');
    
        // Convert Underlined text
        latex = latex.replace(/<u>(.*?)<\/u>/g, '\\underline{$1}');
    
        // Convert Strikethrough text
        latex = latex.replace(/<s>(.*?)<\/s>/g, '\\sout{$1}');
        latex = latex.replace(/<strike>(.*?)<\/strike>/g, '\\sout{$1}');
    
        // Convert Lists
        latex = latex.replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
            return '\\begin{itemize}' + p1.replace(/<li>(.*?)<\/li>/g, '\\item $1') + '\\end{itemize}';
        });
        latex = latex.replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
            return '\\begin{enumerate}' + p1.replace(/<li>(.*?)<\/li>/g, '\\item $1') + '\\end{enumerate}';
        });
    
        // Convert Headers
        latex = latex.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, p1, p2) => {
            const sectionType = 'section'.repeat(p1);
            return '\\' + sectionType + ' ' + p2;
        });
    
        // Convert Blockquotes
        latex = latex.replace(/<blockquote>(.*?)<\/blockquote>/gs, '\\begin{quote}$1\\end{quote}');
    
        // Convert Code blocks
        latex = latex.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '\\begin{verbatim}$1\\end{verbatim}');
    
        // Convert Links
        latex = latex.replace(/<a href="(.*?)">(.*?)<\/a>/g, '\\href{$1}{$2}');
    
        // Convert Images
        latex = latex.replace(/<img src="(.*?)" alt="(.*?)" \/>/g, '\\includegraphics{$1}');
    
        // Convert Font Sizes
        latex = latex.replace(/<span style="font-size:(.*?)">(.*?)<\/span>/g, '\\text{#1}$2');
    
        // Convert Text Color
        latex = latex.replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '\\textcolor{#1}{$2}');
    
        return latex;
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
        const header = `\\documentclass[11pt, a4paper]{article}
            \\usepackage[utf8]{inputenc}
            \\usepackage[margin=1in]{geometry}
            \\usepackage{fontawesome5}
            \\usepackage{ragged2e}
            \\usepackage{enumitem}
            \\usepackage{xcolor}
            \\usepackage{graphicx}
            \\usepackage{hyperref}
            \\usepackage{tcolorbox}
    
            \\definecolor{lightblue}{rgb}{0.8, 0.9, 1} % Light bluish background
            \\definecolor{darkblue}{rgb}{0.1, 0.2, 0.6} % Dark blue border
    
            % Custom section title with full width and centered text
            \\newcommand{\\sectiontitle}[1]{
                \\vspace{10pt}
                \\begin{tcolorbox}[colback=lightblue, colframe=darkblue, width=\\textwidth, boxrule=0mm, arc=0mm, left=0mm, right=0mm, top=1mm, bottom=1mm]
                    \\centering
                    {\\Large \\textbf{#1}}
                \\end{tcolorbox}
                \\vspace{5pt}
            }
    
            \\newcommand{\\subsectiontitle}[2]{\\vspace{5pt}\\noindent\\textbf{#1} \\hfill \\footnotesize #2\\vspace{2pt}}
            \\newcommand{\\subsubsectiontitle}[2]{\\vspace{2pt}\\noindent\\textit{#1} \\hfill \\footnotesize #2\\vspace{2pt}}
            \\newcommand{\\skill}[1]{\\fbox{\\footnotesize #1}}
    
            \\begin{document}
    
            \\begin{flushleft}
                {\\Huge \\textbf{${personalInfo.name || 'Your Name'}}} \\\\
                \\vspace{5pt}
                \\faMapMarker\ \\hspace{0.2cm} ${personalInfo.address || 'Address'} \\\\
                \\faEnvelope\ \\hspace{0.2cm} \\href{mailto:${personalInfo.email || 'email'}}{${personalInfo.email || 'email'}} \\\\
                \\faPhone\ \\hspace{0.2cm} ${personalInfo.phone || 'phone'} \\\\
            \\end{flushleft}
    
            \\vspace{20pt}
        `;
    
        const sectionsLatex = sections.map(section => `
            \\sectiontitle{${htmlToLatex(section.header) || 'Section Title'}} \\\\
            \\noindent ${htmlToLatex(section.description).replace(/\\n/g, '\\\\\\\\') || 'Section content...'}
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
    const previewPdf = () => {
        const latexCode = generateLaTeXCode();
        setTimeout(() => {
            axios.post('/generate-pdf-preview', { latex: latexCode })
                .then(response => {
                    if (response.data.pdf_path) {
                        const pdfPath = response.data.pdf_path; // Get the PDF path from response
                        console.log(pdfPath);
                        const fullUrl = `/storage/temp/${pdfPath}`; // Adjust based on your storage location
                        setPdfUrl(fullUrl);
                    } else {
                        throw new Error('Invalid response: No PDF path returned');
                    }
                })
                .catch(error => {
                    console.error('PDF generation failed:', error);
                    alert('PDF generation failed. Please check your LaTeX syntax.');
                });
        }, 2000);
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
                            <div className="h-40 max-h-40 overflow-scroll">
                                <ReactQuill
                                    theme="snow"
                                    value={section.description}
                                    onChange={(value) => handleSectionChange(index, 'description', value)}
                                    modules={quillModules}
                                    className="h-full"
                                />
                            </div>
                            {/* <textarea
                                value={section.description}
                                onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded h-32"
                                placeholder="Enter LaTeX content (e.g., $E=mc^2$)..."
                            /> */}
                            {/* <div className="mt-2 p-2 bg-gray-50 rounded">
                                <LatexContent content={section.description} />
                            </div> */}
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
                        onClick={previewPdf}
                        className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
                    >
                        Preview PDF
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
                {pdfUrl ? (
                    <embed src={pdfUrl} type="application/pdf" className="w-full h-full border rounded-lg shadow-lg"></embed>
                    // <iframe src={pdfUrl} className="w-full h-full border rounded-lg shadow-lg"></iframe>
                ) : (
                    <div 
                        className="p-6 rounded shadow-lg"
                    >
                        Click Preview PDF to see changes... 
                    </div>
                )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}