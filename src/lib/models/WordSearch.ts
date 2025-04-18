export interface WordSearchCell {
    letter: string;
    row: number;
    col: number;
    selected: boolean;
    highlightedForWord: string | null;
}

export interface WordToFind {
    word: string;
    found: boolean;
    direction?: string;
    startRow?: number;
    startCol?: number;
    endRow?: number;
    endCol?: number;
}

export interface WordSearchPuzzle {
    grid: WordSearchCell[][];
    words: WordToFind[];
    selectedCells: WordSearchCell[];
}