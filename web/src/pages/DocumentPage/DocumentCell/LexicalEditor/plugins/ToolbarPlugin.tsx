import { useCallback, useEffect, useState } from 'react'

import { $createCodeNode } from '@lexical/code'
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text'
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
  CLICK_COMMAND,
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
  Link,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Minus,
  MessageSquareQuote,
  Code,
} from 'lucide-react'
import { UpdateDocumentMutation, UpdateDocumentMutationVariables } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter } from 'src/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { FormField, FormInput } from 'src/components/ui/form'
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
  h1: (
    <>
      <Heading1 className="h-4 w-4" /> Heading 1
    </>
  ),
  h2: (
    <>
      <Heading2 className="h-4 w-4" /> Heading 2
    </>
  ),
  h3: (
    <>
      <Heading3 className="h-4 w-4" /> Heading 3
    </>
  ),
  h4: (
    <>
      <Heading4 className="h-4 w-4" /> Heading 4
    </>
  ),
  h5: (
    <>
      <Heading5 className="h-4 w-4" /> Heading 5
    </>
  ),
  h6: (
    <>
      <Heading6 className="h-4 w-4" /> Heading 6
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
  quote: (
    <>
      <MessageSquareQuote className="h-4 w-4" /> Quote
    </>
  ),
  code: (
    <>
      <Code className="h-4 w-4" /> Code Block
    </>
  ),
}

const listTypeCommands = {
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

interface FormValues {
  url: string
}

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
  const [isCode, setIsCode] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
      setIsCode(selection.hasFormat('code'))

      const node = selection.anchor.getNode()
      const parent = node.getParent()

      setAlignment($isElementNode(node) ? node.getFormatType() : parent.getFormatType() || 'left')
      setIsLink($isLinkNode(parent) || $isLinkNode(node))

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
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
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
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode()
            const linkNode = $findMatchingParent(node, $isLinkNode)

            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }

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

  const formatList = (type: keyof typeof listTypeCommands) => {
    if (blockType !== type) {
      editor.dispatchCommand(listTypeCommands[type], undefined)
    }
  }

  const formatHeading = (headingType: HeadingTagType) => {
    if (blockType !== headingType) {
      editor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createHeadingNode(headingType))
      })
    }
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createQuoteNode())
      })
    }
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection()

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            selection = $getSelection()
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent)
            }
          }
        }
      })
    }
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, data.url)
    setIsOpen(false)
  }

  return (
    <>
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
            <Toggle
              aria-label="Text style formatting options"
              size="sm"
              pressed={false}
              className="gap-2 whitespace-nowrap font-normal"
            >
              {blockTypeElements[blockType]} <ChevronDown className="h-4 w-4" />
            </Toggle>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={blockType}>
              <DropdownMenuRadioItem className="gap-2" value="paragraph" onClick={formatParagraph}>
                {blockTypeElements['paragraph']}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="gap-2" value="h1" onClick={() => formatHeading('h1')}>
                {blockTypeElements['h1']}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="gap-2" value="h2" onClick={() => formatHeading('h2')}>
                {blockTypeElements['h2']}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="gap-2" value="h3" onClick={() => formatHeading('h3')}>
                {blockTypeElements['h3']}
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
              <DropdownMenuRadioItem className="gap-2" value="quote" onClick={formatQuote}>
                {blockTypeElements['quote']}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="gap-2" value="code" onClick={formatCode}>
                {blockTypeElements['code']}
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

        <Toggle
          aria-label="Format Code"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          pressed={isCode}
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Toggle
          aria-label={isLink ? 'Insert Link' : 'Unlink'}
          size="sm"
          onClick={() => {
            if (isLink) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            } else {
              setIsOpen(true)
            }
          }}
          pressed={false}
        >
          {isLink ? <Unlink className="h-4 w-4" /> : <Link className="h-4 w-4" />}
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

        <Divider />

        <Toggle
          aria-label="Insert Horizontal Rule"
          size="sm"
          onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
          pressed={false}
        >
          <Minus className="h-4 w-4" />
        </Toggle>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Form onSubmit={onSubmit} className="space-y-6">
            <FormField name="url" label="Link">
              <FormInput name="url" type="url" validation={{ required: true }} />
            </FormField>

            <DialogFooter>
              <DialogClose>Close</DialogClose>

              <Button type="submit">Save</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ToolbarPlugin
