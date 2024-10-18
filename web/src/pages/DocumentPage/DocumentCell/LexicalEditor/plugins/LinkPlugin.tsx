import { useEffect } from 'react'

import { $isLinkNode } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $findMatchingParent } from '@lexical/utils'
import { $getSelection, $isRangeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical'

const LinkPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
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
  }, [editor])

  return <LexicalLinkPlugin />
}

export default LinkPlugin
