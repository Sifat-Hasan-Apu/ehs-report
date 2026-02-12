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

        // Generate PDF from the preview content if available to avoid capturing hidden/extra
        // layout wrappers that can create an empty first page.
        const element =
            document.getElementById('pdf-preview-content') ||
            document.getElementById('report-content');

        // Ensure print layout is active during PDF capture
        document.body.classList.add('pdf-generating');

        // Margins: [top, left, bottom, right] in mm
        // Top: 10mm for breathing room, Bottom: 18mm to reserve space for footer
        // Top: 22mm to reserve space for the global repeated header
        const PDF_MARGIN_TOP = 22;
        const PDF_MARGIN_LEFT = 15;
        const PDF_MARGIN_BOTTOM = 18;
        const PDF_MARGIN_RIGHT = 15;

        const opt = {
            margin: [PDF_MARGIN_TOP, PDF_MARGIN_LEFT, PDF_MARGIN_BOTTOM, PDF_MARGIN_RIGHT],
            filename: `EHS_Report_${selectedMonthLabel.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'png', quality: 1.0 },
            html2canvas: {
                scale: 2.5,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true,
                scrollY: 0,
                windowWidth: 794, // A4 width in pixels at 96dpi
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: {
                mode: ['css', 'legacy'],
                before: '.pdf-page-break',
                avoid: [
                    '.pdf-inspection-card-v2',
                    '.pdf-evidence-item',
                    '.pdf-keep-together',
                    '.pdf-info-grid',
                    '.pdf-info-box',
                    '.pdf-capa-table',
                    '.pdf-incident-detail-grid',
                    '.pdf-incident-narrative',
                    '.pdf-check-grid',
                    '.pdf-signature-section',
                    'table.pdf-table',
                    '.pdf-incident-body > div'
                ]
            }
        };

        const logoUrl = "/ucpl_logo_v2.png";
        let logoBase64 = null;
        try {
            const response = await fetch(logoUrl);
            const blob = await response.blob();
            logoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error("Logo load error", e);
        }

        try {
            const pdf = await html2pdf().set(opt).from(element).toPdf().get('pdf');

            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Footer Y position: sits inside the bottom margin area, below content
            const footerY = pageHeight - 7;

            // Header Y position constants (mm)
            const HEADER_LINE_Y = 19;
            const HEADER_TEXT_Y = 13.5;
            const LOGO_Y = 7;
            const LOGO_SIZE = 10;

            const COMPANY_NAME = reportData?.basicInfo?.companyName || "United Chattogram Power Limited";

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);

                // --- GLOBAL HEADER (Every page except Cover) ---
                if (i > 1) {
                    // Logo
                    if (logoBase64) {
                        pdf.addImage(logoBase64, 'PNG', PDF_MARGIN_LEFT, LOGO_Y, LOGO_SIZE, LOGO_SIZE);
                    }

                    // Company Name
                    pdf.setFontSize(10.5);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(30, 58, 95); // #1e3a5f
                    pdf.text(COMPANY_NAME, PDF_MARGIN_LEFT + LOGO_SIZE + 3, HEADER_TEXT_Y);

                    // Report Title (Right)
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(`EHS Report - ${selectedMonthLabel}`, pageWidth - PDF_MARGIN_RIGHT, HEADER_TEXT_Y, { align: 'right' });

                    // Header Separator Line
                    pdf.setDrawColor(30, 58, 95);
                    pdf.setLineWidth(0.4);
                    pdf.line(PDF_MARGIN_LEFT, HEADER_LINE_Y, pageWidth - PDF_MARGIN_RIGHT, HEADER_LINE_Y);
                }

                // --- GLOBAL FOOTER ---
                // Draw a thin separator line above footer
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.3);
                pdf.line(PDF_MARGIN_LEFT, footerY - 4, pageWidth - PDF_MARGIN_RIGHT, footerY - 4);

                // Add page number footer (center)
                pdf.setFontSize(7.5);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });

                // Add Confidential Text (Left)
                pdf.setTextColor(200, 0, 0);
                pdf.setFontSize(7);
                pdf.text("CONFIDENTIAL - For Internal Use Only", PDF_MARGIN_LEFT, footerY, { align: 'left' });

                // Add Developer Credit (Right)
                pdf.setTextColor(130, 130, 130);
                pdf.setFontSize(7);
                pdf.text("Developed by Sifat Hasan Apu", pageWidth - PDF_MARGIN_RIGHT, footerY, { align: 'right' });
            }

            await pdf.save();
        } catch (err) {
            console.error("PDF Generation Error:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
            // Reset print layout after generation
            if (!showPreview) {
                document.body.classList.remove('pdf-generating');
            }
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
                            <div id="pdf-preview-content" className="max-w-[210mm] mx-auto bg-white shadow-xl">
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
