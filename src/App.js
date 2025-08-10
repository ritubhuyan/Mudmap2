import React, { useState } from 'react';
import './styles.css';

const MudmapTool = () => {
  const [tiles, setTiles] = useState(Array(16).fill().map((_, i) => ({
    id: i,
    group: null,
    selected: false
  }))
  );
  
  const [nextGroupId, setNextGroupId] = useState(1);
  const [selectedTiles, setSelectedTiles] = useState([]);

  // Handle tile click
  const handleTileClick = (tileId) => {
    const newTiles = [...tiles];
    const tileIndex = newTiles.findIndex(t => t.id === tileId);
    
    newTiles[tileIndex].selected = !newTiles[tileIndex].selected;
    setTiles(newTiles);
    
    if (newTiles[tileIndex].selected) {
      setSelectedTiles([...selectedTiles, tileId]);
    } else {
      setSelectedTiles(selectedTiles.filter(id => id !== tileId));
    }
  };

  // Merge selected tiles
  const handleMerge = () => {
    if (selectedTiles.length < 2) return;
    
    const newTiles = tiles.map(tile => {
      if (selectedTiles.includes(tile.id)) {
        return { ...tile, group: nextGroupId, selected: false };
      }
      return tile;
    });
    
    setTiles(newTiles);
    setSelectedTiles([]);
    setNextGroupId(nextGroupId + 1);
  };

  // Demerge selected tiles
  const handleDemerge = () => {
    if (selectedTiles.length === 0) return;
    
    const groupsToDemerge = new Set();
    selectedTiles.forEach(tileId => {
      const tile = tiles.find(t => t.id === tileId);
      if (tile.group) groupsToDemerge.add(tile.group);
    });
    
    const newTiles = tiles.map(tile => {
      if (groupsToDemerge.has(tile.group)) {
        return { ...tile, group: null, selected: false };
      }
      return tile;
    });
    
    setTiles(newTiles);
    setSelectedTiles([]);
  };

  // Reset all tiles
  const handleReset = () => {
    setTiles(Array(16).fill().map((_, i) => ({
      id: i,
      group: null,
      selected: false
    })));
    setSelectedTiles([]);
    setNextGroupId(1);
  };

  // Calculate grid positions
  const getTileStyle = (tile) => {
    if (!tile.group) return {};
    
    const groupTiles = tiles.filter(t => t.group === tile.group);
    if (groupTiles.length === 1) return {};
    
    const positions = groupTiles.map(t => ({
      row: Math.floor(t.id / 4),
      col: t.id % 4
    }));
    
    const minRow = Math.min(...positions.map(p => p.row));
    const maxRow = Math.max(...positions.map(p => p.row));
    const minCol = Math.min(...positions.map(p => p.col));
    const maxCol = Math.max(...positions.map(p => p.col));
    
    if (tile.id !== groupTiles[0].id) return { display: 'none' };
    
    return {
      gridRow: `${minRow + 1} / ${maxRow + 2}`,
      gridColumn: `${minCol + 1} / ${maxCol + 2}`,
      backgroundColor: `hsl(${tile.group * 60 % 360}, 70%, 80%)`
    };
  };

  return (
    <div className="mudmap-container">
      <h1>Mudmap Catalogue Ideation Tool</h1>
      
      <div className="controls">
        <button onClick={handleMerge} disabled={selectedTiles.length < 2}>
          Merge Selected ({selectedTiles.length})
        </button>
        <button onClick={handleDemerge} disabled={selectedTiles.length === 0}>
          Demerge
        </button>
        <button onClick={handleReset}>Reset All</button>
      </div>
      
      <div className="grid-container">
        {tiles.map(tile => (
          <div
            key={tile.id}
            className={`tile ${tile.selected ? 'selected' : ''} ${tile.group ? 'grouped' : ''}`}
            style={getTileStyle(tile)}
            onClick={() => handleTileClick(tile.id)}
          >
            {tile.group && <div className="group-label">Group {tile.group}</div>}
            <div className="tile-id">{tile.id + 1}</div>
          </div>
        ))}
      </div>
      
      <div className="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Click tiles to select/deselect them</li>
          <li>Select 2+ tiles and click "Merge" to combine them</li>
          <li>Select merged tiles and click "Demerge" to separate them</li>
          <li>Use "Reset All" to start over</li>
        </ul>
      </div>
    </div>
  );
};

export default MudmapTool;