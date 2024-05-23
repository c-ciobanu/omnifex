import { useEffect, useRef } from 'react'

import { useEditor } from '../EditorContext/EditorContext'

export const Editor = () => {
  const { editor } = useEditor()

  const editorContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorContainerRef.current && editor) {
      editorContainerRef.current.innerHTML = ''
      editorContainerRef.current.appendChild(editor)
    }
  }, [editor])

  return <div ref={editorContainerRef} className="w-full" />
}
