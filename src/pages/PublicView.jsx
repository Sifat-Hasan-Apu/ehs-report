import React, { useState, useEffect } from 'react';
import ReportViewer from '../components/ReportViewer';
import { useReportData, useAvailableReports, getCurrentPeriod, MONTH_NAMES } from '../hooks/useReportData';
import { Download, Loader2, Eye, X, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const PublicView = () => {
    const currentPeriod = getCurrentPeriod();
    const { reports: availableReports, loading: reportsLoading } = useAvailableReports();

    // State for selected period
    const [selectedYear, setSelectedYear] = useState(currentPeriod.year);
    const [selectedMonth, setSelectedMonth] = useState(currentPeriod.month);

    // UI states
    const [isDownloading, setIsDownloading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const { reportData } = useReportData(selectedYear, selectedMonth);

    // Set default selection when reports are loaded
    useEffect(() => {
        if (!reportsLoading && availableReports.length > 0) {
            // Check if current month exists in available reports
            const currentExists = availableReports.some(r => r.year === currentPeriod.year && r.month === currentPeriod.month);

            if (currentExists) {
                // Keep current period if it exists
                setSelectedYear(currentPeriod.year);
                setSelectedMonth(currentPeriod.month);
            } else {
                // Otherwise default to the most recent report
                setSelectedYear(availableReports[0].year);
                setSelectedMonth(availableReports[0].month);
            }
        }
    }, [reportsLoading, availableReports]);

    const selectedMonthLabel = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;

    // Open preview modal
    const handlePreview = () => {
        if (reportData?.status === 'draft') {
            alert("Report Not Published\n\nThis report is currently in DRAFT mode. It must be published by an administrator before it can be previewed or downloaded.");
            return;
        }
        setShowPreview(true);
        // Add class to show print layout
        document.body.classList.add('pdf-generating');
    };

    // Close preview modal
    const handleClosePreview = () => {
        setShowPreview(false);
        document.body.classList.remove('pdf-generating');
    };

    // Actual download
    const handleDownload = async () => {
        setIsDownloading(true);

        const element = document.getElementById('report-content');

        const opt = {
            margin: 0,
            filename: `EHS_Report_${selectedMonthLabel.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true,
                scrollY: 0,
                windowWidth: 794, // A4 width in pixels at 96dpi
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.pdf-page-break',
                avoid: ['.pdf-keep-together', '.pdf-inspection-card', '.pdf-info-box', 'tr']
            }
        };

        try {
            const pdf = await html2pdf().set(opt).from(element).toPdf().get('pdf');

            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);

                // Add page number footer
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                const footerText = `Page ${i} of ${totalPages}`;
                pdf.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
            }

            await pdf.save();
        } catch (err) {
            console.error("PDF Generation Error:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Combined change handler for year/month dropdown
    const handlePeriodChange = (e) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setSelectedYear(year);
        setSelectedMonth(month);
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Toolbar / Filter Bar */}
            <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-row items-center justify-between gap-3 md:gap-4 sticky top-14 md:top-20 z-40 transition-shadow duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-1 md:w-1.5 h-5 md:h-6 bg-brand-500 rounded-full shadow-lg shadow-brand-200" />
                    <h2 className="text-sm md:text-lg font-bold text-slate-800 tracking-tight">Report Browser</h2>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs md:text-sm font-medium rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block w-32 md:w-48 p-2 md:p-2.5 transition-all outline-none"
                        value={`${selectedYear}-${selectedMonth}`}
                        onChange={handlePeriodChange}
                    >
                        {availableReports.length > 0 ? (
                            availableReports.map(report => (
                                <option key={`${report.year}-${report.month}`} value={`${report.year}-${report.month}`}>
                                    {MONTH_NAMES[report.month - 1]} {report.year}
                                </option>
                            ))
                        ) : (
                            <option value={`${currentPeriod.year}-${currentPeriod.month}`}>
                                {MONTH_NAMES[currentPeriod.month - 1]} {currentPeriod.year}
                            </option>
                        )}
                    </select>

                    {/* Preview Button */}
                    <button
                        onClick={handlePreview}
                        title="Preview PDF"
                        className="p-2 md:p-2.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-slate-200/50 hover:border-brand-200 flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:inline text-sm font-medium">Preview</span>
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div id="report-content">
                {reportData?.status === 'draft' ? (
                    // Draft Placeholder
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 md:p-20 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                                <FileText className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                                Report Not Published
                            </h3>
                            <p className="text-slate-600">
                                The EHS Report for <span className="font-semibold">{selectedMonthLabel}</span> has not been published yet.
                            </p>
                            <p className="text-sm text-slate-500">
                                Please check back later or contact the administrator.
                            </p>
                        </div>
                    </div>
                ) : (
                    // Published Report
                    <ReportViewer data={reportData} month={selectedMonthLabel} />
                )}
            </div>

            {/* PDF Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
                            <div>
                                <h3 className="font-bold text-slate-800">PDF Preview</h3>
                                <p className="text-xs text-slate-500">This is how the PDF will look when downloaded</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleClosePreview}
                                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Preview Content Area */}
                        <div className="flex-1 overflow-auto p-4 bg-slate-600">
                            <div className="max-w-[210mm] mx-auto bg-white shadow-xl">
                                <ReportViewer data={reportData} month={selectedMonthLabel} isPrintPreview={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicView;
