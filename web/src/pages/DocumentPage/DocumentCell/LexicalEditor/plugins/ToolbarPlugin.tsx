import { useCallback, useEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  RotateCcw,
  RotateCw,
  Save,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { UpdateDocumentMutation, UpdateDocumentMutationVariables } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Toggle } from 'src/components/ui/toggle'

const LowPriority = 1

function Divider() {
  return <div className="mx-1 w-px bg-[#eee]" />
}

const UPDATE_DOCUMENT = gql`
  mutation UpdateDocumentMutation($id: String!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      title
      body
    }
  }
`

type ToolbarPluginProps = {
  documentId: string
}

const ToolbarPlugin = ({ documentId }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [alignment, setAlignment] = useState<ElementFormatType>('left')

  const [updateDocument, { loading }] = useMutation<UpdateDocumentMutation, UpdateDocumentMutationVariables>(
    UPDATE_DOCUMENT
  )

  function onSaveClick() {
    const editorState = editor.getEditorState()
    const jsonString = JSON.stringify(editorState)

    updateDocument({ variables: { id: documentId, input: { body: jsonString } } })
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))

      const node = selection.anchor.getNode()
      const parent = node.getParent()

      setAlignment($isElementNode(node) ? node.getFormatType() : parent.getFormatType() || 'left')
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read($updateToolbar)
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority
      )
    )
  }, [editor, $updateToolbar])

  return (
    <div className="mb-px flex space-x-[2px] overflow-auto rounded-t-md bg-white p-1">
      <Toggle aria-label="Save" size="sm" onClick={onSaveClick} pressed={false} disabled={loading}>
        <Save className="h-4 w-4" />
      </Toggle>

      <Divider />

      <Toggle
        aria-label="Undo"
        size="sm"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        pressed={false}
        disabled={!canUndo}
      >
        <RotateCcw className="h-4 w-4" />
      </Toggle>

      <Toggle
        aria-label="Redo"
        size="sm"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        pressed={false}
        disabled={!canRedo}
      >
        <RotateCw className="h-4 w-4" />
      </Toggle>

      <Divider />

      <Toggle
        aria-label="Format Bold"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        pressed={isBold}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Format Italics"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        pressed={isItalic}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Format Underline"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        pressed={isUnderline}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Format Strikethrough"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        pressed={isStrikethrough}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Divider />

      <Toggle
        aria-label="Left Align"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        pressed={alignment === 'left'}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>

      <Toggle
        aria-label="Center Align"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        pressed={alignment === 'center'}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>

      <Toggle
        aria-label="Right Align"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        pressed={alignment === 'right'}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Toggle
        aria-label="Justify Align"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        pressed={alignment === 'justify'}
      >
        <AlignJustify className="h-4 w-4" />
      </Toggle>
    </div>
  )
}

export default ToolbarPlugin
