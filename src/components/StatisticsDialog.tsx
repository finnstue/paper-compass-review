
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Paper } from './PaperReviewer';

interface StatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  papers: Paper[];
  filteredPapers: Paper[];
}

export const StatisticsDialog: React.FC<StatisticsDialogProps> = ({
  open,
  onOpenChange,
  papers,
  filteredPapers
}) => {
  const totalPapers = papers.length;
  const reviewedPapers = papers.filter(p => p.rating).length;
  const interestingPapers = papers.filter(p => p.rating === 'interesting').length;
  const notInterestingPapers = papers.filter(p => p.rating === 'not-interesting').length;
  const remainingPapers = totalPapers - reviewedPapers;

  const filteredTotal = filteredPapers.length;
  const filteredReviewed = filteredPapers.filter(p => p.rating).length;
  const filteredInteresting = filteredPapers.filter(p => p.rating === 'interesting').length;
  const filteredNotInteresting = filteredPapers.filter(p => p.rating === 'not-interesting').length;
  const filteredRemaining = filteredTotal - filteredReviewed;

  const progressPercentage = totalPapers > 0 ? (reviewedPapers / totalPapers * 100).toFixed(1) : 0;
  const interestingPercentage = reviewedPapers > 0 ? (interestingPapers / reviewedPapers * 100).toFixed(1) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Statistics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Overall Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Papers:</span>
                <Badge variant="outline">{totalPapers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reviewed:</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {reviewedPapers} ({progressPercentage}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interesting:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {interestingPapers}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Not Interesting:</span>
                <Badge variant="default" className="bg-red-100 text-red-800">
                  {notInterestingPapers}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining:</span>
                <Badge variant="outline">{remainingPapers}</Badge>
              </div>
            </div>
          </div>

          {/* Filtered Statistics */}
          {filteredTotal !== totalPapers && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Current Filter</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Total:</span>
                  <Badge variant="outline">{filteredTotal}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Reviewed:</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {filteredReviewed}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Interesting:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {filteredInteresting}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Not Interesting:</span>
                  <Badge variant="default" className="bg-red-100 text-red-800">
                    {filteredNotInteresting}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtered Remaining:</span>
                  <Badge variant="outline">{filteredRemaining}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Additional Insights */}
          {reviewedPapers > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Insights</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Interest rate: {interestingPercentage}% of reviewed papers</p>
                <p>Average: {(reviewedPapers / Math.max(1, Math.ceil(reviewedPapers / 10))).toFixed(1)} papers per session</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
