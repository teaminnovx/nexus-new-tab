import { useState } from 'react';
import { Link2, Plus, Trash2, GripVertical, Edit2, X, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStorage } from '@/hooks/useStorage';
import { QuickLink } from '@/lib/storage';
import { cn } from '@/lib/utils';

export function QuickLinksWidget() {
  const [links, setLinks] = useStorage('quickLinks');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const addLink = async () => {
    if (!newTitle.trim() || !newUrl.trim() || !links) return;

    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const link: QuickLink = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url,
      favicon: getFavicon(url) || undefined,
      order: links.length,
    };

    await setLinks([...links, link]);
    setNewTitle('');
    setNewUrl('');
    setDialogOpen(false);
  };

  const updateLink = async (id: string, title: string, url: string) => {
    if (!links) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    await setLinks(
      links.map((link) =>
        link.id === id
          ? { ...link, title: title.trim(), url: formattedUrl, favicon: getFavicon(formattedUrl) || undefined }
          : link
      )
    );
    setEditingId(null);
  };

  const deleteLink = async (id: string) => {
    if (!links) return;
    await setLinks(links.filter((link) => link.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || !links || draggedId === targetId) return;

    const draggedIndex = links.findIndex((l) => l.id === draggedId);
    const targetIndex = links.findIndex((l) => l.id === targetId);

    const newLinks = [...links];
    const [removed] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, removed);

    // Update order
    const orderedLinks = newLinks.map((link, index) => ({ ...link, order: index }));
    await setLinks(orderedLinks);
    setDraggedId(null);
  };

  return (
    <div className="widget animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link2 className="w-4 h-4" />
          <span className="text-sm font-medium">Quick Links</span>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Add Quick Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  placeholder="Google"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL</label>
                <Input
                  placeholder="https://google.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <Button onClick={addLink} className="w-full" disabled={!newTitle.trim() || !newUrl.trim()}>
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {links?.sort((a, b) => a.order - b.order).map((link) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, link.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, link.id)}
            className={cn(
              'group relative flex flex-col items-center p-3 rounded-xl transition-all cursor-move',
              'hover:bg-background/50',
              draggedId === link.id && 'opacity-50'
            )}
          >
            {editingId === link.id ? (
              <div className="w-full space-y-2">
                <Input
                  defaultValue={link.title}
                  className="h-7 text-xs bg-background/50"
                  id={`title-${link.id}`}
                />
                <Input
                  defaultValue={link.url}
                  className="h-7 text-xs bg-background/50"
                  id={`url-${link.id}`}
                />
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      const titleInput = document.getElementById(`title-${link.id}`) as HTMLInputElement;
                      const urlInput = document.getElementById(`url-${link.id}`) as HTMLInputElement;
                      if (titleInput && urlInput) {
                        updateLink(link.id, titleInput.value, urlInput.value);
                      }
                    }}
                  >
                    <Check className="w-3 h-3 text-green-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    {link.favicon ? (
                      <img
                        src={link.favicon}
                        alt={link.title}
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs text-center truncate w-full">{link.title}</span>
                </a>
                
                {/* Edit/Delete buttons */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingId(link.id);
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteLink(link.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {(!links || links.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Click + to add your favorite links
        </p>
      )}
    </div>
  );
}
