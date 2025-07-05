
export interface CSVRow {
  Title: string;
  Year: string;
  Abstract: string;
  Keywords: string;
  industry: string;
  interesting: string;
  Label_Uses_Computer_Vision: string;
  Label_Solves_Industry_Problem: string;
  Label_Can_Be_Product: string;
  Solution_Sentence: string;
  Layperson_Summary: string;
  Confidence_Comment: string;
}

// Proper CSV parsing function that handles quoted fields
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Handle escaped quotes ("")
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  values.push(current.trim());
  return values;
};

export const transformCSVRowToPaper = (row: CSVRow, id: number) => {
  // Parse keywords from comma-separated string
  const keywords = row.Keywords ? row.Keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];
  
  // Generate mock authors based on paper title
  const generateMockAuthors = (title: string): string[] => {
    const authorCount = Math.floor(Math.random() * 4) + 1; // 1-4 authors
    const authors = [];
    for (let i = 0; i < authorCount; i++) {
      authors.push(`Author ${i + 1}`);
    }
    return authors;
  };

  // Convert string boolean values to actual booleans
  const toBool = (value: string): boolean => {
    return value?.toLowerCase() === 'true' || value === '1';
  };

  // Convert rating string to proper format
  const convertRating = (value: string): 'interesting' | 'not-interesting' | undefined => {
    if (!value || value.toLowerCase() === 'n/a' || value.toLowerCase() === '') return undefined;
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'interesting' ? 'interesting' : 'not-interesting';
  };

  return {
    id,
    title: row.Title || '',
    abstract: row.Abstract || '',
    authors: generateMockAuthors(row.Title),
    keywords,
    year: parseInt(row.Year) || new Date().getFullYear(),
    isIndustry: toBool(row.industry),
    rating: convertRating(row.interesting),
    solutionSentence: row.Solution_Sentence || '',
    laypersonSummary: row.Layperson_Summary || '',
    confidenceComment: row.Confidence_Comment || '',
    tags: {
      computerVision: toBool(row.Label_Uses_Computer_Vision),
      industryProblem: toBool(row.Label_Solves_Industry_Problem),
      productPotential: toBool(row.Label_Can_Be_Product)
    }
  };
};

export const PAPERS_PER_CHUNK = 1000;

export const createPaperChunks = (papers: any[]) => {
  const chunks = [];
  for (let i = 0; i < papers.length; i += PAPERS_PER_CHUNK) {
    chunks.push(papers.slice(i, i + PAPERS_PER_CHUNK));
  }
  return chunks;
};

export const processCSVToPapers = (csvText: string) => {
  console.log('Processing CSV text...');
  
  // Split CSV into lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }
  
  // Parse header row using proper CSV parsing
  const headers = parseCSVLine(lines[0]).map(header => header.replace(/"/g, ''));
  console.log('CSV headers:', headers);
  
  // Create a mapping for the fields we care about
  const fieldMapping: { [key: string]: string } = {
    'Title': 'Title',
    'Year': 'Year', 
    'Abstract': 'Abstract',
    'Author Keywords': 'Keywords', // Map Author Keywords to Keywords
    'Index Keywords': 'Keywords', // We'll handle combining these
    'industry': 'industry',
    'interesting': 'interesting',
    'Label_Uses_Computer_Vision': 'Label_Uses_Computer_Vision',
    'Label_Solves_Industry_Problem': 'Label_Solves_Industry_Problem',
    'Label_Can_Be_Product': 'Label_Can_Be_Product',
    'Solution_Sentence': 'Solution_Sentence',
    'Layperson_Summary': 'Layperson_Summary',
    'Confidence_Comment': 'Confidence_Comment'
  };
  
  // Parse data rows
  const papers = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      // Use proper CSV parsing
      const values = parseCSVLine(lines[i]);
      
      // Create row object with proper field mapping
      const row: any = {};
      headers.forEach((header, index) => {
        const mappedField = fieldMapping[header];
        if (mappedField) {
          const value = values[index] || '';
          
          // Handle keywords combination
          if (mappedField === 'Keywords') {
            if (!row.Keywords) {
              row.Keywords = value;
            } else if (value) {
              // Combine Author Keywords and Index Keywords
              row.Keywords = row.Keywords + (row.Keywords ? '; ' : '') + value;
            }
          } else {
            row[mappedField] = value;
          }
        }
      });
      
      // Transform to paper format
      const paper = transformCSVRowToPaper(row as CSVRow, i);
      papers.push(paper);
    } catch (error) {
      console.warn(`Error processing row ${i}:`, error);
    }
  }
  
  console.log(`Successfully processed ${papers.length} papers from CSV`);
  return papers;
};
