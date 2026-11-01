'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw,
  FileText,
  Send,
  Info
} from 'lucide-react';
import { CANONICAL_LEAD_HEADERS } from '@sellzy/shared';

interface MatchSummary {
  jobId: string;
  sourceFilename: string;
  totalParsed: number;
  exactMatchCount: number;
  grabbedOnlyCount: number;
  excelOnlyCount: number;
  suppressedCount: number;
  matchedRecords: Array<{
    email: string;
    companyName?: string;
    status: string;
    sourceType: string;
    verificationStatus?: string;
  }>;
}

export default function ExcelLeadMatchingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchSummary | null>(null);

  // Filter state for match results table
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
        setErrorMessage('Unsupported format. Please upload a .csv, .xlsx, or .xls spreadsheet.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleRunMatching = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a spreadsheet file first.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/imports/match`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMatchResult(data.data);
      } else {
        setErrorMessage(data.error || 'Failed to parse and match file against lead database.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error occurred while processing file.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredRecords = matchResult?.matchedRecords.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status.toUpperCase() === statusFilter.toUpperCase();
  }) || [];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Marketing Navigation Tab Bar */}
        <MarketingHeaderNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Excel Import &amp; Lead Grabber Matching</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Stage 1 Safe
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Upload client or conference spreadsheets and compare directly against authorized public business leads before campaign creation. Zero auto-dispatch.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="bg-white border-slate-200 text-slate-700"
              onClick={() => {
                const sampleRow = CANONICAL_LEAD_HEADERS.join(',') + '\n' +
                  'contact@acmecorp.com,John,Doe,Acme Corp,https://acmecorp.com,Technology,US,CA,San Francisco,https://directory.com,VERIFIED';
                const blob = new Blob([sampleRow], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'canonical_lead_template.csv';
                a.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Download Canonical Template
            </Button>
          </div>
        </div>

        {/* Safety Disclaimer Callout */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-800 space-y-1">
            <p className="font-bold">Strict Two-Stage Marketing Separation Guarantee</p>
            <p className="font-medium text-amber-700">
              Importing, normalizing, and cross-matching contact emails will <strong>never send emails automatically</strong>. Verified matches remain saved in your tenant lead repository until you explicitly approve and schedule a campaign under Cold Email Campaigns with CAN-SPAM postal address attribution.
            </p>
          </div>
        </div>

        {/* Upload & Inspection Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Box */}
          <Card className="lg:col-span-1 shadow-sm border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                Upload Spreadsheet
              </h2>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-400 transition-colors bg-slate-50/50">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  {selectedFile ? selectedFile.name : 'Select or drop .xlsx, .xls, or .csv file'}
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  Max file size: 10MB • Up to 10,000 rows
                </p>
                <input
                  type="file"
                  id="spreadsheet-file-input"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-slate-300 text-xs font-bold"
                  onClick={() => document.getElementById('spreadsheet-file-input')?.click()}
                >
                  Browse Files
                </Button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 shadow-sm"
                onClick={handleRunMatching}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Matching Against Grabber Leads...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Run 8-Way Match Engine
                  </span>
                )}
              </Button>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">Canonical Schema Compatibility</h3>
                <div className="flex flex-wrap gap-1">
                  {CANONICAL_LEAD_HEADERS.map((h, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Match Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Parsed</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{matchResult?.totalParsed || 0}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">From uploaded file</p>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200 shadow-sm bg-emerald-50/20">
                <CardContent className="p-4">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Exact Match</span>
                  <p className="text-2xl font-black text-emerald-800 mt-1">{matchResult?.exactMatchCount || 0}</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">In Excel &amp; Grabber DB</p>
                </CardContent>
              </Card>

              <Card className="border border-blue-200 shadow-sm bg-blue-50/20">
                <CardContent className="p-4">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Grabbed Only</span>
                  <p className="text-2xl font-black text-blue-800 mt-1">{matchResult?.grabbedOnlyCount || 0}</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-1">Found via Lead Grabber</p>
                </CardContent>
              </Card>

              <Card className="border border-rose-200 shadow-sm bg-rose-50/20">
                <CardContent className="p-4">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Suppressed</span>
                  <p className="text-2xl font-black text-rose-800 mt-1">{matchResult?.suppressedCount || 0}</p>
                  <p className="text-[11px] text-rose-600 font-medium mt-1">Unsub / Do-not-contact</p>
                </CardContent>
              </Card>
            </div>

            {/* Match Analysis Breakdown */}
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Matched Dataset Records
                    </h2>
                    {matchResult && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                        {filteredRecords.length} records
                      </span>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {['ALL', 'EXACT_MATCH', 'EXCEL_ONLY', 'GRABBED_ONLY', 'SUPPRESSED'].map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          statusFilter === f ? 'bg-white shadow-sm text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {f.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr className="bg-slate-50/75 border-b border-slate-200">
                        <Th className="pl-6 font-bold text-slate-600">Contact Email</Th>
                        <Th className="font-bold text-slate-600">Company</Th>
                        <Th className="font-bold text-slate-600">Match Status</Th>
                        <Th className="font-bold text-slate-600">Source</Th>
                        <Th className="pr-6 font-bold text-slate-600">Verification</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {!matchResult ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-12 text-slate-400 font-medium text-xs">
                            Upload a spreadsheet and click &apos;Run 8-Way Match Engine&apos; to view matched records.
                          </Td>
                        </Tr>
                      ) : filteredRecords.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-8 text-slate-400 font-medium text-xs">
                            No records found matching filter &quot;{statusFilter}&quot;.
                          </Td>
                        </Tr>
                      ) : (
                        filteredRecords.map((r, i) => (
                          <Tr key={i} className="hover:bg-slate-50/50">
                            <Td className="pl-6 font-semibold text-slate-900 text-xs font-mono">{r.email}</Td>
                            <Td className="text-xs text-slate-700 font-medium">{r.companyName || '—'}</Td>
                            <Td>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold ${
                                  r.status === 'EXACT_MATCH'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : r.status === 'SUPPRESSED'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : r.status === 'GRABBED_ONLY'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {r.status}
                              </Badge>
                            </Td>
                            <Td className="text-xs text-slate-500 font-medium">{r.sourceType}</Td>
                            <Td className="pr-6">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold ${
                                  r.verificationStatus === 'DELIVERABLE' || r.verificationStatus === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : r.verificationStatus === 'RISKY'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {r.verificationStatus || 'UNVERIFIED'}
                              </Badge>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

