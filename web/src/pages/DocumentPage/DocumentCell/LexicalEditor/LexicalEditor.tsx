import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { DocumentQuery } from 'types/graphql'

import ToolbarPlugin from './plugins/ToolbarPlugin'

const placeholder = 'Enter some text...'

const editorConfig = {
  namespace: 'lexical-editor',
  nodes: [],
  onError(error: Error) {
    throw error
  },
  theme: {
    ltr: 'text-left',
    rtl: 'text-right',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      strikethrough: 'line-through',
      underline: 'underline',
      underlineStrikethrough: 'underline-line-through',
    },
  },
}

type LexicalEditorProps = {
  document: DocumentQuery['document']
}

const LexicalEditor = (props: LexicalEditorProps) => {
  const { document } = props

  return (
    <LexicalComposer initialConfig={{ ...editorConfig, editorState: document.body ?? undefined }}>
      <ToolbarPlugin />

      <div className="relative rounded-b-md bg-white">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[180px] resize-none px-3 py-4 outline-none"
              aria-placeholder={placeholder}
              placeholder={
                <div className="pointer-events-none absolute left-3 top-4 inline-block select-none overflow-hidden text-ellipsis text-muted-foreground">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin defaultSelection="rootStart" />
      </div>
    </LexicalComposer>
  )
}

export default LexicalEditor
