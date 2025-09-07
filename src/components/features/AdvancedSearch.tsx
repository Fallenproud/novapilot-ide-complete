import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  FileText, 
  Code2, 
  Filter,
  Clock,
  Bookmark,
  Settings2,
  Hash,
  CaseSensitive,
  Square
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useEditorStore } from '@/stores/editorStore';

interface SearchResult {
  fileId: string;
  fileName: string;
  filePath: string;
  line: number;
  column: number;
  text: string;
  context: string;
  matchStart: number;
  matchEnd: number;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  options: SearchOptions;
  timestamp: Date;
}

interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  includeComments: boolean;
  fileTypes: string[];
}

const AdvancedSearch = ({ children }: { children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [options, setOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    includeComments: true,
    fileTypes: ['ts', 'tsx', 'js', 'jsx', 'css', 'html', 'json'],
  });

  const { activeProject } = useProjectStore();
  const { openTab } = useEditorStore();

  // Search functionality
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !activeProject) return;

    setIsSearching(true);
    setResults([]);

    try {
      const searchResults: SearchResult[] = [];
      
      for (const file of activeProject.files) {
        // Filter by file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension && options.fileTypes.length > 0 && !options.fileTypes.includes(fileExtension)) {
          continue;
        }

        const lines = file.content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          let searchText = options.caseSensitive ? line : line.toLowerCase();
          let searchPattern = options.caseSensitive ? searchQuery : searchQuery.toLowerCase();

          // Handle regex search
          if (options.regex) {
            try {
              const regex = new RegExp(searchPattern, options.caseSensitive ? 'g' : 'gi');
              let match;
              while ((match = regex.exec(line)) !== null) {
                searchResults.push({
                  fileId: file.id,
                  fileName: file.name,
                  filePath: file.path,
                  line: i + 1,
                  column: match.index + 1,
                  text: line.trim(),
                  context: lines.slice(Math.max(0, i - 1), i + 2).join('\n'),
                  matchStart: match.index,
                  matchEnd: match.index + match[0].length,
                });
              }
            } catch (error) {
              // Invalid regex, fall back to plain text
              searchPattern = searchQuery;
            }
          } else {
            // Handle whole word search
            if (options.wholeWord) {
              const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(searchPattern)}\\b`, options.caseSensitive ? 'g' : 'gi');
              let match;
              while ((match = wordBoundaryRegex.exec(line)) !== null) {
                searchResults.push({
                  fileId: file.id,
                  fileName: file.name,
                  filePath: file.path,
                  line: i + 1,
                  column: match.index + 1,
                  text: line.trim(),
                  context: lines.slice(Math.max(0, i - 1), i + 2).join('\n'),
                  matchStart: match.index,
                  matchEnd: match.index + match[0].length,
                });
              }
            } else {
              // Simple substring search
              const index = searchText.indexOf(searchPattern);
              if (index !== -1) {
                searchResults.push({
                  fileId: file.id,
                  fileName: file.name,
                  filePath: file.path,
                  line: i + 1,
                  column: index + 1,
                  text: line.trim(),
                  context: lines.slice(Math.max(0, i - 1), i + 2).join('\n'),
                  matchStart: index,
                  matchEnd: index + searchPattern.length,
                });
              }
            }
          }
        }
      }

      setResults(searchResults);

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(0, 10);
        return newHistory;
      });

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [activeProject, options]);

  // Escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Handle search input
  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query);
    }
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Navigate to search result
  const navigateToResult = (result: SearchResult) => {
    const file = activeProject?.files.find(f => f.id === result.fileId);
    if (file) {
      openTab({
        id: file.id,
        name: file.name,
        path: file.path,
        language: file.language,
        fileId: file.id,
      });
      
      // TODO: Add line navigation functionality
      // This would require integration with the Monaco editor
    }
    setIsOpen(false);
  };

  // Save search
  const saveSearch = () => {
    if (!query.trim()) return;

    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: `Search: ${query}`,
      query,
      options: { ...options },
      timestamp: new Date(),
    };

    setSavedSearches(prev => [savedSearch, ...prev].slice(0, 20));
  };

  // Load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setOptions(savedSearch.options);
    performSearch(savedSearch.query);
  };

  // Highlight search term in text
  const highlightText = (text: string, start: number, end: number) => {
    if (start === -1 || end === -1) return text;
    
    return (
      <>
        {text.substring(0, start)}
        <span className="bg-yellow-400/30 text-yellow-900 dark:text-yellow-200 px-1 rounded">
          {text.substring(start, end)}
        </span>
        {text.substring(end)}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Replace
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="flex-1 flex flex-col space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Search across all files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" onClick={saveSearch} disabled={!query.trim()}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center space-x-2">
                <Switch
                  id="case-sensitive"
                  checked={options.caseSensitive}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, caseSensitive: checked }))}
                />
                <Label htmlFor="case-sensitive" className="flex items-center gap-1">
                  <CaseSensitive className="h-3 w-3" />
                  Case
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="regex"
                  checked={options.regex}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, regex: checked }))}
                />
                <Label htmlFor="regex" className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Regex
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="whole-word"
                  checked={options.wholeWord}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, wholeWord: checked }))}
                />
                <Label htmlFor="whole-word" className="flex items-center gap-1">
                  <Square className="h-3 w-3" />
                  Word
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-comments"
                  checked={options.includeComments}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeComments: checked }))}
                />
                <Label htmlFor="include-comments">Comments</Label>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{results.length} results</Badge>
                    <span className="text-sm text-muted-foreground">in {activeProject?.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 border rounded-md">
                  <div className="space-y-1 p-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigateToResult(result)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{result.fileName}</span>
                            <span className="text-xs text-muted-foreground">
                              Line {result.line}:{result.column}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-mono bg-muted/30 p-2 rounded text-foreground">
                          {highlightText(result.text, result.matchStart, result.matchEnd)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{result.filePath}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {query && results.length === 0 && !isSearching && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try adjusting your search options</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {searchHistory.map((historyItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setQuery(historyItem);
                      performSearch(historyItem);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{historyItem}</span>
                    </div>
                  </div>
                ))}
                {searchHistory.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No search history yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="saved" className="flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {savedSearches.map((savedSearch) => (
                  <div
                    key={savedSearch.id}
                    className="flex items-center justify-between p-3 rounded border hover:bg-muted/50 cursor-pointer"
                    onClick={() => loadSavedSearch(savedSearch)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{savedSearch.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {savedSearch.query} • {savedSearch.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedSearches(prev => prev.filter(s => s.id !== savedSearch.id));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {savedSearches.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No saved searches yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;