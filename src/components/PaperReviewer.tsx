import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, RotateCcw, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { JumpToDialog } from './JumpToDialog';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { processCSVToPapers } from '../utils/csvProcessor';

export interface Paper {
  id: number;
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  year: number;
  isIndustry: boolean;
  rating?: 'interesting' | 'not-interesting';
  solutionSentence?: string;
  laypersonSummary?: string;
  confidenceComment?: string;
  tags: {
    computerVision: boolean;
    industryProblem: boolean;
    productPotential: boolean;
  };
}

const PaperReviewer = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnrated, setShowOnlyUnrated] = useState(false);
  const [showOnlyIndustry, setShowOnlyIndustry] = useState(false);
  const [showOnlyComputerVision, setShowOnlyComputerVision] = useState(false);
  const [showOnlyProduct, setShowOnlyProduct] = useState(false);
  const [randomOrder, setRandomOrder] = useState(false);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [showJumpTo, setShowJumpTo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPapers, setTotalPapers] = useState(0);
  const [csvUploaded, setCsvUploaded] = useState(false);

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage('Processing CSV file...');

    try {
      const text = await file.text();
      console.log('CSV file loaded, processing...');
      
      const processedPapers = processCSVToPapers(text);
      console.log(`Processed ${processedPapers.length} papers from CSV`);
      
      if (processedPapers.length === 0) {
        throw new Error('No valid papers found in CSV file');
      }

      setPapers(processedPapers);
      setTotalPapers(processedPapers.length);
      setCsvUploaded(true);
      setStatusMessage(`Successfully loaded ${processedPapers.length} papers`);
      
      toast({
        title: "CSV Uploaded Successfully",
        description: `Loaded ${processedPapers.length} papers for review.`
      });
      
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error processing CSV:', error);
      setStatusMessage('Error processing CSV file');
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to process CSV file. Please check the format.",
        variant: "destructive"
      });
      setTimeout(() => setStatusMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters with improved performance
  const applyFilters = useCallback(() => {
    if (!csvUploaded) return;
    
    console.log('Applying filters to', papers.length, 'papers');
    let filtered = [...papers];

    // Apply search filter with basic indexing
    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      filtered = filtered.filter(paper => 
        searchWords.every(word => 
          paper.title.toLowerCase().includes(word) ||
          paper.abstract.toLowerCase().includes(word) ||
          paper.authors.some(author => author.toLowerCase().includes(word)) ||
          paper.keywords.some(keyword => keyword.toLowerCase().includes(word)) ||
          paper.laypersonSummary?.toLowerCase().includes(word) ||
          paper.solutionSentence?.toLowerCase().includes(word)
        )
      );
    }

    // Apply other filters
    if (showOnlyUnrated) {
      filtered = filtered.filter(paper => !paper.rating);
    }

    if (showOnlyIndustry) {
      filtered = filtered.filter(paper => paper.isIndustry);
    }

    if (showOnlyComputerVision) {
      filtered = filtered.filter(paper => paper.tags.computerVision);
    }

    if (showOnlyProduct) {
      filtered = filtered.filter(paper => paper.tags.productPotential);
    }

    // Apply random order
    if (randomOrder) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    console.log('Filtered papers:', filtered.length);
    setFilteredPapers(filtered);
    
    // Adjust current index if needed
    if (filtered.length > 0 && currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [papers, searchTerm, showOnlyUnrated, showOnlyIndustry, showOnlyComputerVision, showOnlyProduct, randomOrder, currentIndex, csvUploaded]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const ratePaper = (rating: 'interesting' | 'not-interesting') => {
    if (!currentPaper) return;
    
    console.log(`Rating paper ${currentPaper.id} as ${rating}`);
    
    const updatedPapers = papers.map(paper => paper.id === currentPaper.id ? {
      ...paper,
      rating
    } : paper);
    
    setPapers(updatedPapers);

    // Move to next paper
    if (currentIndex < filteredPapers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const updatePaperField = (field: keyof Paper, value: string) => {
    if (!currentPaper) return;
    const updatedPapers = papers.map(paper => paper.id === currentPaper.id ? {
      ...paper,
      [field]: value
    } : paper);
    setPapers(updatedPapers);
  };

  const saveProgress = () => {
    try {
      // Convert papers back to CSV format
      const headers = [
        'Title', 'Year', 'Abstract', 'Keywords', 'industry', 'interesting',
        'Label_Uses_Computer_Vision', 'Label_Solves_Industry_Problem', 'Label_Can_Be_Product',
        'Solution_Sentence', 'Layperson_Summary', 'Confidence_Comment'
      ];

      const csvContent = [
        headers.join(','),
        ...papers.map(paper => [
          `"${paper.title.replace(/"/g, '""')}"`,
          paper.year,
          `"${paper.abstract.replace(/"/g, '""')}"`,
          `"${paper.keywords.join(', ')}"`,
          paper.isIndustry ? 'true' : 'false',
          paper.rating === 'interesting' ? 'true' : paper.rating === 'not-interesting' ? 'false' : '',
          paper.tags.computerVision ? 'true' : 'false',
          paper.tags.industryProblem ? 'true' : 'false',
          paper.tags.productPotential ? 'true' : 'false',
          `"${(paper.solutionSentence || '').replace(/"/g, '""')}"`,
          `"${(paper.laypersonSummary || '').replace(/"/g, '""')}"`,
          `"${(paper.confidenceComment || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `papers_reviewed_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage('Progress saved successfully');
      setTimeout(() => setStatusMessage(''), 2000);
      toast({
        title: "Progress Saved",
        description: "Your ratings and progress have been downloaded as a CSV file."
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!csvUploaded) return;
    
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => document.getElementById('search-input')?.focus(), 100);
      }
      return;
    }
    switch (e.key.toLowerCase()) {
      case 'm':
        ratePaper('interesting');
        break;
      case 'x':
        ratePaper('not-interesting');
        break;
      case 'n':
        if (currentIndex < filteredPapers.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
        break;
      case 'p':
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        break;
      case 'j':
        setShowJumpTo(true);
        break;
      case 's':
        saveProgress();
        break;
      case 'f':
        if (!e.ctrlKey) {
          setShowSearch(true);
          setTimeout(() => document.getElementById('search-input')?.focus(), 100);
        }
        break;
      case 'c':
        setSearchTerm('');
        setShowOnlyUnrated(false);
        setShowOnlyIndustry(false);
        setShowOnlyComputerVision(false);
        setShowOnlyProduct(false);
        setRandomOrder(false);
        setShowSearch(false);
        break;
      case 'u':
        setShowOnlyUnrated(!showOnlyUnrated);
        break;
      case 'i':
        setShowOnlyIndustry(!showOnlyIndustry);
        break;
      case 'v':
        setShowOnlyComputerVision(!showOnlyComputerVision);
        break;
      case 'b':
        setShowOnlyProduct(!showOnlyProduct);
        break;
      case 'r':
        setRandomOrder(!randomOrder);
        break;
    }
  }, [currentIndex, filteredPapers.length, showOnlyUnrated, showOnlyIndustry, showOnlyComputerVision, showOnlyProduct, randomOrder, csvUploaded]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const clearFilters = () => {
    setSearchTerm('');
    setShowOnlyUnrated(false);
    setShowOnlyIndustry(false);
    setShowOnlyComputerVision(false);
    setShowOnlyProduct(false);
    setRandomOrder(false);
    setShowSearch(false);
    setStatusMessage('Filters cleared');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  // Get current paper from the updated filtered papers
  const currentPaper = filteredPapers[currentIndex];
  const progress = filteredPapers.length > 0 ? (currentIndex + 1) / filteredPapers.length * 100 : 0;

  if (!csvUploaded && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Academic Paper Reviewer
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Upload your CSV file containing academic papers to start reviewing. 
              The file should include columns for title, abstract, authors, keywords, and other paper details.
            </p>
            
            <div className="space-y-4">
              <label 
                htmlFor="csv-upload" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV File
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <p className="text-sm text-gray-500">
                Supported format: CSV files (.csv)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">{statusMessage || 'Processing...'}</p>
        </div>
      </div>
    );
  }

  if (!currentPaper && filteredPapers.length === 0 && papers.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Papers Match Your Filters</h2>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
          <Button onClick={clearFilters} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          filteredPapersLength={filteredPapers.length}
          isLoading={isLoading}
          ratePaper={ratePaper}
          setShowJumpTo={setShowJumpTo}
          saveProgress={saveProgress}
          showOnlyUnrated={showOnlyUnrated}
          setShowOnlyUnrated={setShowOnlyUnrated}
          showOnlyIndustry={showOnlyIndustry}
          setShowOnlyIndustry={setShowOnlyIndustry}
          showOnlyComputerVision={showOnlyComputerVision}
          setShowOnlyComputerVision={setShowOnlyComputerVision}
          showOnlyProduct={showOnlyProduct}
          setShowOnlyProduct={setShowOnlyProduct}
          randomOrder={randomOrder}
          setRandomOrder={setRandomOrder}
        />

        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header with Progress */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Paper {currentIndex + 1} of {filteredPapers.length}
                    {filteredPapers.length !== totalPapers && ` (${totalPapers} total)`}
                    {searchTerm && ' (filtered)'}
                    {randomOrder && ' (random order)'}
                  </span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {currentPaper ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="p-6 space-y-6">
                      {/* Labels and Quick Information */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Labels</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {currentPaper.year}
                          </Badge>
                          <Badge
                            variant={currentPaper.rating ? "default" : "outline"}
                            className={`text-xs ${
                              currentPaper.rating === 'interesting'
                                ? 'bg-green-100 text-green-800'
                                : currentPaper.rating === 'not-interesting'
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-600'
                            }`}
                          >
                            {currentPaper.rating
                              ? currentPaper.rating === 'interesting'
                                ? 'Interesting'
                                : 'Not Interesting'
                              : 'Not Reviewed'}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              currentPaper.tags.computerVision
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {currentPaper.tags.computerVision ? '✓ Computer Vision' : '✗ Computer Vision'}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              currentPaper.tags.industryProblem
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {currentPaper.tags.industryProblem ? '✓ Industry Problem' : '✗ Industry Problem'}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              currentPaper.tags.productPotential
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {currentPaper.tags.productPotential ? '✓ Product Potential' : '✗ Product Potential'}
                          </Badge>
                        </div>
                      </div>

                      {/* Layperson Summary */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Layperson Summary</h3>
                        <p className="text-gray-800">
                          {currentPaper.laypersonSummary || 'No summary provided'}
                        </p>
                      </div>

                      {/* Solution Sentence */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Solution Sentence</h3>
                        <p className="text-gray-800">
                          {currentPaper.solutionSentence || 'No solution sentence provided'}
                        </p>
                      </div>

                      {/* Detailed Information */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                          <p className="text-gray-800">{currentPaper.title}</p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Abstract</h3>
                          <p className="text-gray-700 leading-relaxed">{currentPaper.abstract}</p>
                        </div>

                        {/* Confidence Comment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confidence Comment
                          </label>
                          <Textarea
                            value={currentPaper.confidenceComment || ''}
                            onChange={(e) => updatePaperField('confidenceComment', e.target.value)}
                            placeholder="Add any confidence notes or comments..."
                            className="min-h-[60px]"
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading papers...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar */}
            {statusMessage && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-sm">
                {statusMessage}
              </div>
            )}

            {/* Dialogs */}
            <JumpToDialog
              open={showJumpTo}
              onOpenChange={setShowJumpTo}
              maxIndex={filteredPapers.length}
              onJump={(index) => setCurrentIndex(index - 1)}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PaperReviewer;
