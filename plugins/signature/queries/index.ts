import { Editor } from '@ckeditor/ckeditor5-core';
import { EditorWithUI } from '@ckeditor/ckeditor5-core/src/editor/editorwithui';
import { Element } from '@ckeditor/ckeditor5-engine';

export const isSignatureField = (element: Element): boolean =>
  element.name === 'signatureField';

export function* getSignatureFieldsInDocument(
  editor: Editor | EditorWithUI
): Generator<Element> {
  const docRoot = editor.model.document.getRoot();
  const range = editor.model.createRangeIn(docRoot);

  for (const value of range.getWalker()) {
    switch (value.type) {
      case 'elementStart':
        if (isSignatureField(value.item)) {
          yield value.item;
        }
        break;
    }
  }
}
