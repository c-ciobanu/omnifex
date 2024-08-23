import { LinkNode, AutoLinkNode } from '@lexical/link'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from '@lexical/react/LexicalAutoLinkPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { DocumentQuery } from 'types/graphql'

import ToolbarPlugin from './plugins/ToolbarPlugin'

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(?<![-.+():%])/

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) => (text.startsWith('http') ? text : `https://${text}`)),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`),
]

const placeholder = 'Enter some text...'

const editorConfig = {
  namespace: 'lexical-editor',
  nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode],
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
    link: 'text-blue-500 no-underline	hover:cursor-pointer hover:underline',
    list: {
      listitem: 'mx-8 my-0',
      listitemChecked:
        'relative !ml-3 list-none pl-[26px] line-through outline-none before:absolute before:left-0 before:h-full before:cursor-pointer before:pt-1 before:content-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zcXVhcmUtY2hlY2stYmlnIj48cGF0aCBkPSJNMjEgMTAuNVYxOWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTIuNSIvPjxwYXRoIGQ9Im05IDExIDMgM0wyMiA0Ii8+PC9zdmc+)]',
      listitemUnchecked:
        'relative !ml-3 list-none pl-[26px] outline-none before:absolute before:left-0 before:h-full before:cursor-pointer before:pt-1 before:content-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNxdWFyZSI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjwvc3ZnPg==)]',
      nested: {
        listitem: 'list-none before:content-none',
      },
      olDepth: ['list-decimal', 'list-[upper-alpha]', 'list-[upper-roman]'],
      ulDepth: ['list-disc', 'list-[circle]', 'list-[square]'],
      ol: 'p-0',
      ul: 'p-0',
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
      <ToolbarPlugin documentId={document.id} />

      <div className="relative rounded-b-md bg-white">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="prose min-h-[180px] max-w-none resize-none px-3 py-4 outline-none"
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
        <TabIndentationPlugin />

        <LinkPlugin />
        <AutoLinkPlugin matchers={MATCHERS} />
        <ListPlugin />
        <CheckListPlugin />
      </div>
    </LexicalComposer>
  )
}

export default LexicalEditor
