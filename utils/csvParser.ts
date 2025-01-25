export function parseCSV(text: string, delimiter: string = ';'): string[][] {
  // Split into lines and filter out empty lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    let fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        fields.push(currentField.replace(/"/g, '').trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Push the last field
    fields.push(currentField.replace(/"/g, '').trim());
    
    return fields;
  });
}
