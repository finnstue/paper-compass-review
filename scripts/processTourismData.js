
const fs = require('fs');
const path = require('path');

// Simple CSV parser function
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }
  
  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/"/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim().replace(/"/g, ''));
  return values;
}

// Transform CSV row to Paper format
function transformToPaper(row, index) {
  // Parse keywords from string to array
  const keywords = row.Keywords ? 
    row.Keywords.split(',').map(k => k.trim()).filter(k => k) : 
    [];
  
  // Generate mock authors (since not in CSV)
  const authors = [`Author ${index + 1}`, `Co-Author ${index + 1}`];
  
  // Convert boolean-like strings to actual booleans
  const toBool = (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  };
  
  // Map rating field
  let rating = undefined;
  if (row.interesting === 'True' || row.interesting === 'true') {
    rating = 'interesting';
  } else if (row.interesting === 'False' || row.interesting === 'false') {
    rating = 'not-interesting';
  }
  
  return {
    id: index + 1,
    title: row.Title || `Paper ${index + 1}`,
    abstract: row.Abstract || 'No abstract available',
    authors: authors,
    keywords: keywords,
    year: parseInt(row.Year) || 2024,
    isIndustry: row.industry && row.industry.trim() !== '',
    rating: rating,
    solutionSentence: row.Solution_Sentence || '',
    laypersonSummary: row.Layperson_Summary || '',
    confidenceComment: row.Confidence_Comment || '',
    tags: {
      computerVision: toBool(row.Label_Uses_Computer_Vision),
      industryProblem: toBool(row.Label_Solves_Industry_Problem),
      productPotential: toBool(row.Label_Can_Be_Product)
    }
  };
}

// Main processing function
async function processTourismData() {
  try {
    console.log('Reading tourism.csv...');
    const csvPath = path.join(__dirname, '..', 'tourism.csv');
    const csvText = fs.readFileSync(csvPath, 'utf8');
    
    console.log('Parsing CSV data...');
    const csvData = parseCSV(csvText);
    console.log(`Found ${csvData.length} papers in CSV`);
    
    console.log('Transforming data to Paper format...');
    const papers = csvData.map((row, index) => transformToPaper(row, index));
    
    // Create public/data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Split into chunks of 1000 papers each
    const chunkSize = 1000;
    const chunks = [];
    
    for (let i = 0; i < papers.length; i += chunkSize) {
      chunks.push(papers.slice(i, i + chunkSize));
    }
    
    console.log(`Creating ${chunks.length} chunk files...`);
    
    // Save each chunk as a separate JSON file
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = path.join(dataDir, `papers-chunk-${i}.json`);
      fs.writeFileSync(chunkPath, JSON.stringify(chunks[i], null, 2));
      console.log(`Created ${chunkPath} with ${chunks[i].length} papers`);
    }
    
    // Create a metadata file with information about the dataset
    const metadata = {
      totalPapers: papers.length,
      totalChunks: chunks.length,
      chunkSize: chunkSize,
      processedAt: new Date().toISOString(),
      source: 'tourism.csv'
    };
    
    const metadataPath = path.join(dataDir, 'dataset-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log('\n✅ Processing complete!');
    console.log(`📊 Total papers: ${papers.length}`);
    console.log(`📁 Created ${chunks.length} chunk files`);
    console.log(`💾 Files saved to: ${dataDir}`);
    console.log('\nYou can now run your app and the papers will load automatically!');
    
  } catch (error) {
    console.error('❌ Error processing tourism data:', error);
    process.exit(1);
  }
}

// Run the processing
processTourismData();
