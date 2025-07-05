
import React from 'react';
import { Search, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  filteredPapersLength: number;
  isLoading: boolean;
  ratePaper: (rating: 'interesting' | 'not-interesting') => void;
  setShowJumpTo: (show: boolean) => void;
  saveProgress: () => void;
  showOnlyUnrated: boolean;
  setShowOnlyUnrated: (show: boolean) => void;
  showOnlyIndustry: boolean;
  setShowOnlyIndustry: (show: boolean) => void;
  showOnlyComputerVision: boolean;
  setShowOnlyComputerVision: (show: boolean) => void;
  showOnlyProduct: boolean;
  setShowOnlyProduct: (show: boolean) => void;
  randomOrder: boolean;
  setRandomOrder: (random: boolean) => void;
}

export function AppSidebar({
  searchTerm,
  setSearchTerm,
  showSearch,
  setShowSearch,
  currentIndex,
  setCurrentIndex,
  filteredPapersLength,
  isLoading,
  ratePaper,
  setShowJumpTo,
  saveProgress,
  showOnlyUnrated,
  setShowOnlyUnrated,
  showOnlyIndustry,
  setShowOnlyIndustry,
  showOnlyComputerVision,
  setShowOnlyComputerVision,
  showOnlyProduct,
  setShowOnlyProduct,
  randomOrder,
  setRandomOrder,
}: AppSidebarProps) {
  return (
    <Sidebar className="w-64" collapsible="none">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Paper Reviewer</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {!showSearch ? (
                <Button onClick={() => setShowSearch(true)} variant="outline" size="sm" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Search (F)
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search-input"
                      placeholder="Search papers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={() => setShowSearch(false)} variant="outline" size="sm" className="w-full">
                    Close
                  </Button>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <Button onClick={saveProgress} variant="outline" size="sm" className="w-full justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save Progress (S)
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={showOnlyUnrated}
                  onCheckedChange={(checked) => setShowOnlyUnrated(checked === true)}
                />
                Hide rated (U)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={showOnlyIndustry}
                  onCheckedChange={(checked) => setShowOnlyIndustry(checked === true)}
                />
                Industry only (I)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={showOnlyComputerVision}
                  onCheckedChange={(checked) => setShowOnlyComputerVision(checked === true)}
                />
                Computer Vision (V)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={showOnlyProduct}
                  onCheckedChange={(checked) => setShowOnlyProduct(checked === true)}
                />
                Product potential (B)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={randomOrder}
                  onCheckedChange={(checked) => setRandomOrder(checked === true)}
                />
                Random order (R)
              </label>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {isLoading && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="flex items-center gap-2 text-sm text-gray-600 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
