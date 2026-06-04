import { useState } from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { allTags } from "../data/mock-routes";

interface TagManagerDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const tagColors: Record<string, string> = {
  好路: "#10b981", 烂路: "#ef4444", gravel: "#f97316", 风景好: "#06b6d4",
  适合新手: "#22c55e", 挑战: "#ef4444", 山路: "#a855f7", 环湖: "#0ea5e9",
  绿道: "#10b981", 休闲: "#14b8a6", 短途: "#84cc16", 爬坡: "#f43f5e",
  无车: "#22c55e", 湿地: "#14b8a6", 经典路线: "#f59e0b", 夜骑: "#6366f1",
  市区: "#78716c",
};

export function TagManagerDialog({ open, onClose, selectedTags, onTagsChange }: TagManagerDialogProps) {
  const [search, setSearch] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selected, setSelected] = useState<string[]>(selectedTags);

  if (!open) return null;

  const filtered = allTags.filter(
    (t) => t.includes(search) || search === "",
  );

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addNew = () => {
    const name = newTagName.trim();
    if (name && !selected.includes(name)) {
      setSelected((prev) => [...prev, name]);
      setNewTagName("");
    }
  };

  const handleSave = () => {
    onTagsChange(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl animate-page-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-stone-100">管理标签</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Currently selected */}
        {selected.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-stone-600 font-display mb-2">已选标签</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.map((tag) => (
                <Badge
                  key={tag}
                  color={tagColors[tag] || "#f59e0b"}
                  onRemove={() => toggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search existing tags */}
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索已有标签..."
            className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Tag list */}
        <div className="max-h-48 overflow-y-auto rounded-lg border border-stone-800/60 bg-stone-900/30 p-2 space-y-0.5">
          {filtered.map((tag) => {
            const isSelected = selected.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                <span>{tag}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-3 text-center text-xs text-stone-600">没有匹配的标签</p>
          )}
        </div>

        {/* Create new tag */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNew()}
            placeholder="新建标签..."
            className="flex-1 rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50"
          />
          <Button variant="secondary" size="sm" onClick={addNew}>
            添加
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-stone-800/60">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>确定</Button>
        </div>
      </div>
    </div>
  );
}
