/**
 * MediLens AI - Spatially-Aware Grid Reconstruction Engine
 * 
 * Reconstructs tabular grid structures from raw Tesseract OCR word coordinate packets.
 * Resolves column alignment mismatches and missing cells locally.
 */

/**
 * Main entry point to parse Tesseract word packets into structured lab values.
 * @param {Array} words - Array of { text, bbox: { x0, y0, x1, y1 }, confidence }
 * @returns {Array} Extracted structured parameters.
 */
function parseSpatialLayout(words) {
  if (!words || words.length === 0) return [];

  const debug = window.DEBUG_SPATIAL === true;

  // 1. Group words into horizontal rows based on vertical overlap
  const rowsOfWords = groupWordsIntoRows(words);
  if (debug) console.log("[Spatial Debug] Segmented Rows of Words:", rowsOfWords);

  // 2. Group adjacent words on each row into coherent cells (using horizontal gaps)
  const rowsOfCells = rowsOfWords.map(row => groupWordsIntoCells(row));
  if (debug) console.log("[Spatial Debug] Grouped Row Cells:", rowsOfCells);

  // 3. Cluster column start coordinates to find the global grid structure
  const columnCenters = detectColumnGrid(rowsOfCells);
  if (debug) console.log("[Spatial Debug] Detected Column Centroids (x-coordinates):", columnCenters);

  // 4. Align cells in each row to the global column grid
  const structuredRows = alignCellsToGrid(rowsOfCells, columnCenters);
  if (debug) console.log("[Spatial Debug] Reconstructed Row Grid:", structuredRows);

  // 5. Filter and format the structured rows into biomarker reports
  return compileLabValues(structuredRows);
}

/**
 * Groups raw OCR words into horizontal rows.
 */
function groupWordsIntoRows(words, verticalThresholdPercent = 0.5) {
  // Sort words vertically by top coordinate (y0)
  const sortedWords = [...words]
    .filter(w => w.text && w.text.trim().length > 0)
    .sort((a, b) => a.bbox.y0 - b.bbox.y0);

  const rows = [];
  
  sortedWords.forEach(word => {
    const { y0, y1 } = word.bbox;
    const height = y1 - y0;
    
    // Find an existing row where this word overlaps vertically
    let matchedRow = rows.find(row => {
      const overlapStart = Math.max(row.y0, y0);
      const overlapEnd = Math.min(row.y1, y1);
      const overlapHeight = overlapEnd - overlapStart;
      
      if (overlapHeight <= 0) return false;
      
      // If the overlap is greater than the threshold of either height, they are on the same line
      const minHeight = Math.min(row.height, height);
      return overlapHeight > minHeight * verticalThresholdPercent;
    });

    if (matchedRow) {
      matchedRow.words.push(word);
      // Update row bounds
      matchedRow.y0 = Math.min(matchedRow.y0, y0);
      matchedRow.y1 = Math.max(matchedRow.y1, y1);
      matchedRow.height = matchedRow.y1 - matchedRow.y0;
    } else {
      rows.push({
        y0,
        y1,
        height,
        words: [word]
      });
    }
  });

  // Sort words in each row horizontally from left to right (x0)
  rows.forEach(row => {
    row.words.sort((a, b) => a.bbox.x0 - b.bbox.x0);
  });

  // Sort rows vertically
  return rows.sort((a, b) => a.y0 - b.y0);
}

/**
 * Groups adjacent words on the same row into cells by checking horizontal gaps.
 */
function groupWordsIntoCells(row, spaceThresholdMultiplier = 2.5) {
  const cells = [];
  const words = row.words;
  if (words.length === 0) return [];

  // Calculate average word spacing in this row for dynamic gap detection
  let totalGap = 0;
  let gapCount = 0;
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i+1].bbox.x0 - words[i].bbox.x1;
    if (gap > 0) {
      totalGap += gap;
      gapCount++;
    }
  }
  
  // Base threshold is either average spacing scaled, or a default minimum
  const avgSpace = gapCount > 0 ? (totalGap / gapCount) : 10;
  const threshold = Math.max(avgSpace * spaceThresholdMultiplier, 30);

  let currentCell = {
    text: words[0].text,
    x0: words[0].bbox.x0,
    x1: words[0].bbox.x1,
    y0: words[0].bbox.y0,
    y1: words[0].bbox.y1
  };

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const gap = word.bbox.x0 - currentCell.x1;

    if (gap > threshold) {
      // Large gap: complete current cell and start a new one
      cells.push(currentCell);
      currentCell = {
        text: word.text,
        x0: word.bbox.x0,
        x1: word.bbox.x1,
        y0: word.bbox.y0,
        y1: word.bbox.y1
      };
    } else {
      // Small gap: merge word into current cell
      currentCell.text += " " + word.text;
      currentCell.x1 = Math.max(currentCell.x1, word.bbox.x1);
      currentCell.y0 = Math.min(currentCell.y0, word.bbox.y0);
      currentCell.y1 = Math.max(currentCell.y1, word.bbox.y1);
    }
  }
  
  cells.push(currentCell);
  return cells;
}

/**
 * Detects global column starting x-coordinates by clustering cell coordinates.
 */
function detectColumnGrid(rowsOfCells, clusterMergeThreshold = 55) {
  const allXCoords = [];
  rowsOfCells.forEach(cells => {
    cells.forEach(cell => {
      allXCoords.push(cell.x0);
    });
  });

  if (allXCoords.length === 0) return [];

  // Sort x coordinates
  allXCoords.sort((a, b) => a - b);

  // Group coordinates into clusters
  const clusters = [];
  let currentCluster = [allXCoords[0]];

  for (let i = 1; i < allXCoords.length; i++) {
    const x = allXCoords[i];
    const prevX = allXCoords[i - 1];

    if (x - prevX > clusterMergeThreshold) {
      clusters.push(currentCluster);
      currentCluster = [x];
    } else {
      currentCluster.push(x);
    }
  }
  clusters.push(currentCluster);

  // Map clusters to average coordinate and filter out low-density noise
  const columnCenters = clusters
    .map(c => {
      const sum = c.reduce((acc, val) => acc + val, 0);
      return {
        center: Math.round(sum / c.length),
        count: c.length
      };
    })
    // Filter out rare clusters (noise) to maintain strong structural peaks
    .filter(col => col.count >= Math.max(2, rowsOfCells.length * 0.1))
    .map(col => col.center)
    .sort((a, b) => a - b);

  // We expect at most 4 primary columns (Test, Value, Unit, Reference)
  // If we found more, we cap to the most structured ones
  return columnCenters;
}

/**
 * Aligns segmented row cells to the global column grid centers.
 */
function alignCellsToGrid(rowsOfCells, columnCenters) {
  if (columnCenters.length === 0) {
    return rowsOfCells.map(cells => cells.map(c => c.text));
  }

  return rowsOfCells.map(rowCells => {
    // Initialize empty slots matching grid size
    const gridRow = Array(columnCenters.length).fill("");
    
    rowCells.forEach(cell => {
      // Find the closest column center
      let minDistance = Infinity;
      let matchedIndex = 0;
      
      columnCenters.forEach((center, index) => {
        const distance = Math.abs(cell.x0 - center);
        if (distance < minDistance) {
          minDistance = distance;
          matchedIndex = index;
        }
      });

      // Place cell text into the slot (merge if already occupied)
      if (gridRow[matchedIndex] === "") {
        gridRow[matchedIndex] = cell.text.trim();
      } else {
        gridRow[matchedIndex] += " " + cell.text.trim();
      }
    });

    return gridRow;
  });
}

/**
 * Normalizes and filters rows into structured lab records.
 */
function compileLabValues(gridRows) {
  const compiled = [];

  gridRows.forEach(row => {
    // Clean up empty cells
    const cleanCells = row.map(c => (c || "").trim());
    
    // Look for rows that have at least a Name and a Numeric Value
    // Typically: Name is index 0, Value is index 1, Unit is index 2, Reference Range is index 3
    if (cleanCells.length >= 2) {
      const name = cleanCells[0];
      const valStr = cleanCells[1];
      
      // Check if value resembles a reading (contains numbers)
      const numberMatch = valStr.match(/(\d+(?:\.\d+)?)/);
      
      if (name && numberMatch && name.toLowerCase() !== "test name" && name.toLowerCase() !== "parameter") {
        const value = parseFloat(numberMatch[0]);
        let unit = cleanCells[2] || "";
        let refRange = cleanCells[3] || "";

        // If index 2 contains reference-range-like strings (e.g. hyphens or limits), shift it
        if (unit.includes("-") || unit.startsWith("<") || unit.startsWith(">")) {
          refRange = unit;
          unit = "";
        }

        compiled.push({
          name: name,
          value: value,
          unit: unit,
          referenceRange: refRange
        });
      }
    }
  });

  return compiled;
}
