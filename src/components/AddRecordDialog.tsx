import { useState } from "react";
import { Button } from "./ui/Button";
import { StarRating } from "./ui/StarRating";

interface AddRecordDialogProps {
  open: boolean;
  onClose: () => void;
  routeName: string;
}

export function AddRecordDialog({ open, onClose, routeName }: AddRecordDialogProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [weather, setWeather] = useState("");
  const [stravaUrl, setStravaUrl] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl animate-page-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-stone-100">添加骑行记录</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-stone-600 mb-5">{routeName}</p>

        <div className="space-y-4">
          {/* Date + Weather row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display text-stone-400 mb-1.5">骑行日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-display text-stone-400 mb-1.5">天气（可选）</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/50"
              >
                <option value="">选择天气</option>
                <option value="晴">晴</option>
                <option value="多云">多云</option>
                <option value="阴">阴</option>
                <option value="小雨">小雨</option>
                <option value="大雨">大雨</option>
                <option value="大风">大风</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-display text-stone-400 mb-1.5">体验评分</label>
            <StarRating value={rating} size="lg" interactive onChange={setRating} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-display text-stone-400 mb-1.5">骑行感受</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="写点骑行感受... 路况怎么样？风景如何？有什么值得记录的？"
              className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-700 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
            />
          </div>

          {/* Strava link */}
          <div>
            <label className="block text-xs font-display text-stone-400 mb-1.5">Strava 链接（可选）</label>
            <input
              type="url"
              value={stravaUrl}
              onChange={(e) => setStravaUrl(e.target.value)}
              placeholder="https://strava.com/activities/..."
              className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 placeholder-stone-700 outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Photos placeholder */}
          <div>
            <label className="block text-xs font-display text-stone-400 mb-1.5">照片（可选）</label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-stone-700 bg-stone-900/30 px-4 py-5 text-center cursor-pointer hover:border-stone-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-600 mx-auto">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-xs text-stone-600">点击或拖拽上传照片</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-800/60">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>保存记录</Button>
        </div>
      </div>
    </div>
  );
}
