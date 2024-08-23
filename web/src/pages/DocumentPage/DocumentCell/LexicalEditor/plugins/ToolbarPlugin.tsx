import { useCallback, useEffect, useState } from 'react'

import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
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
  ChevronDown,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  RotateCcw,
  RotateCw,
  Save,
  Strikethrough,
  Text,
  Underline,
} from 'lucide-react'
import { UpdateDocumentMutation, UpdateDocumentMutationVariables } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { Toggle } from 'src/components/ui/toggle'

function Divider() {
  return <div className="mx-1 w-px bg-[#eee]" />
}

const blockTypeElements = {
  paragraph: (
    <>
      <Text className="h-4 w-4" /> Paragraph
    </>
  ),
  bullet: (
    <>
      <List className="h-4 w-4" /> Bulleted list
    </>
  ),
  number: (
    <>
      <ListOrdered className="h-4 w-4" /> Numbered list
    </>
  ),
  check: (
    <>
      <ListTodo className="h-4 w-4" /> Checklist
    </>
  ),
}

const blockTypeCommands = {
  bullet: INSERT_UNORDERED_LIST_COMMAND,
  number: INSERT_ORDERED_LIST_COMMAND,
  check: INSERT_CHECK_LIST_COMMAND,
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
  const [blockType, setBlockType] = useState<keyof typeof blockTypeElements>('paragraph')
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

      let element =
        node.getKey() === 'root'
          ? node
          : $findMatchingParent(node, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = node.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (elementDOM) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(node, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()
          setBlockType(type)
        } else {
          const type = element.getType()
          if (type in blockTypeElements) {
            setBlockType(type as keyof typeof blockTypeElements)
          }
        }
      }
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
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, $updateToolbar])

  function formatParagraph() {
    editor.update(() => {
      const selection = $getSelection()

      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, $createParagraphNode)
      }
    })
  }

  const formatList = (type: keyof typeof blockTypeCommands) => {
    if (blockType !== type) {
      editor.dispatchCommand(blockTypeCommands[type], undefined)
    }
  }

  return (
    <div className="mb-px flex space-x-1 overflow-auto rounded-t-md bg-white p-1">
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle aria-label="Text style formatting options" size="sm" pressed={false} className="gap-2 font-normal">
            {blockTypeElements[blockType]} <ChevronDown className="h-4 w-4" />
          </Toggle>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={blockType}>
            <DropdownMenuRadioItem className="gap-2" value="paragraph" onClick={formatParagraph}>
              {blockTypeElements['paragraph']}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="gap-2" value="bullet" onClick={() => formatList('bullet')}>
              {blockTypeElements['bullet']}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="gap-2" value="number" onClick={() => formatList('number')}>
              {blockTypeElements['number']}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="gap-2" value="check" onClick={() => formatList('check')}>
              {blockTypeElements['check']}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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
