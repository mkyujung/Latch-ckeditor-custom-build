import { Editor } from '@ckeditor/ckeditor5-core';
import { EditorWithUI } from '@ckeditor/ckeditor5-core/src/editor/editorwithui';
import { Element } from '@ckeditor/ckeditor5-engine';

export const isSmartfield = (element: Element): boolean => {
  return element.name === 'smartfield';
};

export function* getSmartfieldIdsInDocument(
  editor: Editor | EditorWithUI
): Generator<string> {
  const docRoot = editor.model.document.getRoot();
  const range = editor.model.createRangeIn(docRoot);
  for (const value of range.getWalker()) {
    switch (value.type) {
      case 'elementStart':
        if (isSmartfield(value.item)) {
          const smartfieldId = value.item.getAttribute('id');
          yield smartfieldId;
        }
        break;
    }
  }
}

export function* getSmartfieldElementsInDocument(
  editor: Editor | EditorWithUI
): Generator<Element> {
  const docRoot = editor.model.document.getRoot();
  const range = editor.model.createRangeIn(docRoot);
  for (const value of range.getWalker()) {
    switch (value.type) {
      case 'elementStart':
        if (isSmartfield(value.item)) {
          yield value.item;
        }
        break;
    }
  }
}

export function* getSmartfieldsById(
  editor: Editor | EditorWithUI,
  ids: string[]
): Generator<Element> {
  const docRoot = editor.model.document.getRoot();
  const range = editor.model.createRangeIn(docRoot);

  for (const value of range.getWalker()) {
    switch (value.type) {
      case 'elementStart':
        if (
          isSmartfield(value.item) &&
          ids.includes(value.item.getAttribute('id'))
        ) {
          yield value.item;
        }
        break;
    }
  }
}
