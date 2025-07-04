import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, BarChart3, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { StatisticsDialog } from './StatisticsDialog';
import { JumpToDialog } from './JumpToDialog';
import { mockPapers } from '../data/mockPapers';
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
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnrated, setShowOnlyUnrated] = useState(false);
  const [showOnlyIndustry, setShowOnlyIndustry] = useState(false);
  const [showOnlyComputerVision, setShowOnlyComputerVision] = useState(false);
  const [randomOrder, setRandomOrder] = useState(false);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>(papers);
  const [showStats, setShowStats] = useState(false);
  const [showJumpTo, setShowJumpTo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Filter papers based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...papers];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      filtered = filtered.filter(paper => searchWords.every(word => paper.title.toLowerCase().includes(word) || paper.abstract.toLowerCase().includes(word) || paper.authors.some(author => author.toLowerCase().includes(word)) || paper.keywords.some(keyword => keyword.toLowerCase().includes(word))));
    }

    // Apply unrated filter
    if (showOnlyUnrated) {
      filtered = filtered.filter(paper => !paper.rating);
    }

    // Apply industry filter
    if (showOnlyIndustry) {
      filtered = filtered.filter(paper => paper.isIndustry);
    }

    // Apply computer vision filter
    if (showOnlyComputerVision) {
      filtered = filtered.filter(paper => paper.tags.computerVision);
    }

    // Apply random order
    if (randomOrder) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    setFilteredPapers(filtered);
    if (filtered.length > 0 && currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [papers, searchTerm, showOnlyUnrated, showOnlyIndustry, showOnlyComputerVision, randomOrder, currentIndex]);
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  const currentPaper = filteredPapers[currentIndex];
  const progress = filteredPapers.length > 0 ? (currentIndex + 1) / filteredPapers.length * 100 : 0;
  const ratePaper = (rating: 'interesting' | 'not-interesting') => {
    if (!currentPaper) return;
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
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
        setShowStats(true);
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
      case 'r':
        setRandomOrder(!randomOrder);
        break;
    }
  }, [currentIndex, filteredPapers.length, showOnlyUnrated, showOnlyIndustry, showOnlyComputerVision, randomOrder]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  const clearFilters = () => {
    setSearchTerm('');
    setShowOnlyUnrated(false);
    setShowOnlyIndustry(false);
    setShowOnlyComputerVision(false);
    setRandomOrder(false);
    setShowSearch(false);
    setStatusMessage('Filters cleared');
    setTimeout(() => setStatusMessage(''), 2000);
  };
  const saveProgress = () => {
    setStatusMessage('Progress saved successfully');
    setTimeout(() => setStatusMessage(''), 2000);
    toast({
      title: "Progress Saved",
      description: "Your ratings and progress have been saved."
    });
  };
  if (!currentPaper) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Papers Found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
          <Button onClick={clearFilters} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>;
  }
  ;
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Paper Reviewer</h1>
          <div className="flex items-center gap-2">
            {!showSearch ? <Button onClick={() => setShowSearch(true)} variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search (F)
              </Button> : <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="search-input" placeholder="Search papers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                </div>
                <Button onClick={() => setShowSearch(false)} variant="outline" size="sm">
                  Close
                </Button>
              </div>}
            <Button onClick={() => setShowStats(true)} variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics (S)
            </Button>
            <Button onClick={saveProgress} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Paper {currentIndex + 1} of {filteredPapers.length}
              {searchTerm && ' (filtered)'}
              {randomOrder && ' (random order)'}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 text-sm mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={showOnlyUnrated} onCheckedChange={checked => setShowOnlyUnrated(checked === true)} />
            Hide rated (U)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={showOnlyIndustry} onCheckedChange={checked => setShowOnlyIndustry(checked === true)} />
            Industry only (I)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={showOnlyComputerVision} onCheckedChange={checked => setShowOnlyComputerVision(checked === true)} />
            Computer Vision only (V)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={randomOrder} onCheckedChange={checked => setRandomOrder(checked === true)} />
            Random order (R)
          </label>
          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear (C)
          </Button>
        </div>

        {/* Navigation and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous (P)
            </Button>
            <Button onClick={() => setCurrentIndex(Math.min(filteredPapers.length - 1, currentIndex + 1))} disabled={currentIndex === filteredPapers.length - 1} variant="outline" size="sm">
              Next (N)
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button onClick={() => setShowJumpTo(true)} variant="outline" size="sm">
              Jump to... (J)
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => ratePaper('interesting')} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Interesting (M)
            </Button>
            <Button onClick={() => ratePaper('not-interesting')} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
              <ThumbsDown className="w-4 h-4 mr-2" />
              Not Interesting (X)
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="p-6 space-y-6">
              {/* Labels and Quick Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentPaper.year}
                  </Badge>
                  <Badge variant={currentPaper.rating ? "default" : "outline"} className={`text-xs ${currentPaper.rating === 'interesting' ? 'bg-green-100 text-green-800' : currentPaper.rating === 'not-interesting' ? 'bg-red-100 text-red-800' : 'text-gray-600'}`}>
                    {currentPaper.rating ? currentPaper.rating === 'interesting' ? 'Interesting' : 'Not Interesting' : 'Not Reviewed'}
                  </Badge>
                  <Badge className={`text-xs ${currentPaper.tags.computerVision ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentPaper.tags.computerVision ? '✓ Computer Vision' : '✗ Computer Vision'}
                  </Badge>
                  <Badge className={`text-xs ${currentPaper.tags.industryProblem ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentPaper.tags.industryProblem ? '✓ Industry Problem' : '✗ Industry Problem'}
                  </Badge>
                  <Badge className={`text-xs ${currentPaper.tags.productPotential ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentPaper.tags.productPotential ? '✓ Product Potential' : '✗ Product Potential'}
                  </Badge>
                </div>
              </div>

              {/* Layperson Summary */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Layperson Summary</h3>
                <p className="text-gray-700">
                  {currentPaper.laypersonSummary || 'No summary provided'}
                </p>
              </div>

              {/* Solution Sentence */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Solution Sentence</h3>
                <p className="text-gray-700">
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

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Authors</h3>
                  <p className="text-gray-700">{currentPaper.authors.join(', ')}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentPaper.keywords.map((keyword, index) => <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>)}
                  </div>
                </div>

                {/* Confidence Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Comment
                  </label>
                  <Textarea value={currentPaper.confidenceComment || ''} onChange={e => updatePaperField('confidenceComment', e.target.value)} placeholder="Add any confidence notes or comments..." className="min-h-[60px]" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Status Bar */}
      {statusMessage && <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-sm">
          {statusMessage}
        </div>}

      {/* Dialogs */}
      <StatisticsDialog open={showStats} onOpenChange={setShowStats} papers={papers} filteredPapers={filteredPapers} />
      <JumpToDialog open={showJumpTo} onOpenChange={setShowJumpTo} maxIndex={filteredPapers.length} onJump={index => setCurrentIndex(index - 1)} />
    </div>;
};
export default PaperReviewer;