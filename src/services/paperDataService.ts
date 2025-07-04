
import { Paper } from '../components/PaperReviewer';

export class PaperDataService {
  private loadedChunks: Set<number> = new Set();
  private papers: Paper[] = [];
  private totalChunks = 0;
  private isLoading = false;

  constructor() {
    // Initialize with first chunk
    this.loadChunk(0);
  }

  async loadChunk(chunkIndex: number): Promise<Paper[]> {
    if (this.loadedChunks.has(chunkIndex) || this.isLoading) {
      return this.papers;
    }

    this.isLoading = true;
    
    try {
      // In a real implementation, you'd load from actual chunk files
      // For now, we'll simulate with the existing mock data
      const response = await fetch(`/data/papers-chunk-${chunkIndex}.json`);
      
      if (!response.ok) {
        // Fallback to mock data if chunk doesn't exist
        const { mockPapers } = await import('../data/mockPapers');
        return mockPapers;
      }
      
      const chunkData = await response.json();
      
      // Add chunk to loaded papers
      const startIndex = chunkIndex * 1000;
      chunkData.forEach((paper: Paper, index: number) => {
        this.papers[startIndex + index] = paper;
      });
      
      this.loadedChunks.add(chunkIndex);
      return this.papers.filter(p => p !== undefined);
    } catch (error) {
      console.error(`Error loading chunk ${chunkIndex}:`, error);
      // Fallback to mock data
      const { mockPapers } = await import('../data/mockPapers');
      return mockPapers;
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreChunks(currentIndex: number): Promise<Paper[]> {
    const currentChunk = Math.floor(currentIndex / 1000);
    const nextChunk = currentChunk + 1;
    
    // Load next chunk if not already loaded
    if (!this.loadedChunks.has(nextChunk)) {
      await this.loadChunk(nextChunk);
    }
    
    return this.papers.filter(p => p !== undefined);
  }

  getAllLoadedPapers(): Paper[] {
    return this.papers.filter(p => p !== undefined);
  }

  getLoadingStatus() {
    return {
      isLoading: this.isLoading,
      loadedChunks: this.loadedChunks.size,
      totalChunks: this.totalChunks
    };
  }
}

export const paperDataService = new PaperDataService();
