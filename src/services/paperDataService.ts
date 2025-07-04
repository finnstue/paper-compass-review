
import { Paper } from '../components/PaperReviewer';

export class PaperDataService {
  private loadedChunks: Set<number> = new Set();
  private papers: Paper[] = [];
  private totalChunks = 0;
  private totalPapers = 0;
  private isLoading = false;

  constructor() {
    this.loadMetadata();
  }

  async loadMetadata(): Promise<void> {
    try {
      const response = await fetch('/data/dataset-metadata.json');
      if (response.ok) {
        const metadata = await response.json();
        this.totalChunks = metadata.totalChunks;
        this.totalPapers = metadata.totalPapers;
        console.log('Loaded metadata:', metadata);
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  }

  async loadChunk(chunkIndex: number): Promise<Paper[]> {
    if (this.loadedChunks.has(chunkIndex) || this.isLoading) {
      return this.papers.filter(p => p !== undefined);
    }

    this.isLoading = true;
    console.log(`Loading chunk ${chunkIndex}...`);
    
    try {
      const response = await fetch(`/data/papers-chunk-${chunkIndex}.json`);
      
      if (!response.ok) {
        console.log(`Chunk ${chunkIndex} not found, loading mock data`);
        const { mockPapers } = await import('../data/mockPapers');
        this.papers = [...mockPapers];
        return this.papers;
      }
      
      const chunkData = await response.json();
      console.log(`Loaded chunk ${chunkIndex} with ${chunkData.length} papers`);
      
      // Add chunk to loaded papers
      const startIndex = chunkIndex * 1000;
      chunkData.forEach((paper: Paper, index: number) => {
        this.papers[startIndex + index] = paper;
      });
      
      this.loadedChunks.add(chunkIndex);
      const filteredPapers = this.papers.filter(p => p !== undefined);
      console.log(`Total loaded papers: ${filteredPapers.length}`);
      return filteredPapers;
    } catch (error) {
      console.error(`Error loading chunk ${chunkIndex}:`, error);
      // Fallback to mock data
      const { mockPapers } = await import('../data/mockPapers');
      this.papers = [...mockPapers];
      return this.papers;
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreChunks(currentIndex: number): Promise<Paper[]> {
    const currentChunk = Math.floor(currentIndex / 1000);
    const nextChunk = currentChunk + 1;
    
    // Load next chunk if not already loaded and if it exists
    if (!this.loadedChunks.has(nextChunk) && nextChunk < this.totalChunks) {
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
      totalChunks: this.totalChunks,
      totalPapers: this.totalPapers
    };
  }
}

export const paperDataService = new PaperDataService();
