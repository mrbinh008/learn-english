'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, Loader2, Bookmark, BookmarkCheck } from 'lucide-react'
import TTSButton from './TTSButton'

interface WordData {
  english: string
  vietnamese: string
  phonetic?: string
  partOfSpeech?: string
  definitions: string[]
  examples: string[]
  synonyms: string[]
  antonyms: string[]
}

interface WordPopupProps {
  word: string
  position: { x: number; y: number }
  onClose: () => void
  onSave?: (word: WordData) => void
}

export function WordPopup({ word, position, onClose, onSave }: WordPopupProps) {
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/dictionary/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, saveToDb: true })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch word')
        }

        const data = await response.json()
        setWordData(data.word)
        
        // If word was already in database, mark as saved
        if (data.source === 'database') {
          setSaved(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchWordData()
  }, [word])

  const handleSave = async () => {
    if (!wordData || saved) return
    
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(wordData)
      }
      setSaved(true)
    } catch (err) {
      console.error('Error saving word:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate popup position (adjust to stay within viewport)
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 400),
    top: Math.min(position.y + 20, window.innerHeight - 400),
    zIndex: 1000,
    maxWidth: '380px',
    maxHeight: '500px'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[999]"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        style={popupStyle}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{word}</h3>
            {wordData && <TTSButton text={word} iconOnly className="!bg-white/20 hover:!bg-white/30 !text-white" />}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[400px]">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-600">
              <p className="font-medium">Không thể tra từ</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {wordData && (
            <div className="p-4 space-y-4">
              {/* Vietnamese translation & phonetic */}
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {wordData.vietnamese}
                </p>
                {wordData.phonetic && (
                  <p className="text-sm text-gray-500 mt-1">{wordData.phonetic}</p>
                )}
                {wordData.partOfSpeech && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {wordData.partOfSpeech}
                  </span>
                )}
              </div>

              {/* Definitions */}
              {wordData.definitions && wordData.definitions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Định nghĩa:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {wordData.definitions.map((def, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-blue-500 font-bold">{i + 1}.</span>
                        <span>{def}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {wordData.examples && wordData.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ví dụ:</h4>
                  <ul className="space-y-2 text-sm">
                    {wordData.examples.map((ex, i) => (
                      <li key={i} className="bg-gray-50 p-2 rounded italic text-gray-600">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms */}
              {wordData.synonyms && wordData.synonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Từ đồng nghĩa:</h4>
                  <div className="flex flex-wrap gap-2">
                    {wordData.synonyms.map((syn, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {wordData.antonyms && wordData.antonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Từ trái nghĩa:</h4>
                  <div className="flex flex-wrap gap-2">
                    {wordData.antonyms.map((ant, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Save button */}
        {wordData && onSave && (
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <button
              onClick={handleSave}
              disabled={saved || isSaving}
              className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                saved
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Đã lưu
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Lưu từ vựng
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
