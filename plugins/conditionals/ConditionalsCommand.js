import Command from '@ckeditor/ckeditor5-core/src/command';
import { getSmartfieldElementsInDocument } from '../smartfields-repository/queries';
import ConditionalsRefreshCommand from './ConditionalsRefreshCommand';

const CONDITIONAL = 'conditional';

export default class ConditionalsCommand extends Command {
  static eventId = 'conditionals-command';

  refresh() {
    const model = this.editor.model;
    const doc = model.document;

    console.log('REFRESHED?');

    this.value = doc.selection.getAttribute(CONDITIONAL);
    this.isEnabled = model.schema.checkAttributeInSelection(
      doc.selection,
      CONDITIONAL
    );
  }

  execute(params) {
    const { editor } = this;
    const { model } = editor;
    const { document } = model;
    const { selection } = document;

    const smartfields = getSmartfieldElementsInDocument(editor);



    // console.log('params', params);

    model.change((writer) => {
      
      // from what I gathered 1 selection has 1 range
      const range = selection.getFirstRange();
      writer.setSelection(editor.model.document.getRoot(), "in")
      

      const flatRanges = range.getMinimalFlatRanges();

      console.log('FLATRANGES', flatRanges);


      flatRanges.forEach((range) => {
        const conditionalEl = writer.createElement('conditional', params);
        writer.wrap(range, conditionalEl);
      });


    });
  }

  _addConditionalAttributesOnSelection(
    writer,
    isMet,
    smartfieldId,
    condition,
    value
  ) {
    writer.setSelectionAttribute(CONDITIONAL, true);
    writer.setSelectionAttribute('smartfieldId', smartfieldId);
    writer.setSelectionAttribute('condition', condition);
    writer.setSelectionAttribute('value', value);
  }
  //
  _addConditionalAttributesOnRange(
    writer,
    range,
    isMet,
    smartfieldId,
    condition,
    value
  ) {
    writer.setAttribute(CONDITIONAL, true, range);
    writer.setAttribute('smartfieldId', smartfieldId, range);
    writer.setAttribute('condition', condition, range);
    writer.setAttribute('value', value, range);
  }

  checkCondition(smartfields, conditionalParams) {
    for (const smartfield of smartfields) {
      const id = smartfield.getAttribute('id');
      if (id === conditionalParams.smartfieldId) {
        const value = smartfield.getAttribute('value');
        if (value === conditionalParams.value) {
          return true;
        }
      }
    }

    return false;
  }
}
