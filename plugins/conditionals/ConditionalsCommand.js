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
      // writer.setSelection(editor.model.document.getRoot(), "in")
      

      const flatRanges = range.getMinimalFlatRanges();

      console.log('FLATRANGES', flatRanges);


      flatRanges.forEach((range) => {
        const el = range.getContainedElement()
        if(el && el.name === "conditional"){
          writer.unwrap(el)
        } else {
          const conditionalEl = writer.createElement('conditional', params);
          writer.wrap(range, conditionalEl);
        }
      });


    });
  }


  // execute(params) {
  //   const { editor } = this;
  //   const { model } = editor;
  //   const { document } = model;
  //   const { selection } = document;

  //   console.log("params",params)

  //   model.change((writer) => {
  //     console.log(selection.isCollapsed ? 'COLLAPSED' : 'NOT COLLAPSED');
  //     if (selection.isCollapsed) {

  //       if(selection.hasAttribute(CONDITIONAL)){
  //         writer.removeSelectionAttribute(CONDITIONAL)
  //       } else {
  //         // writer.setSelectionAttribute(CONDITIONAL, true);
  //         this._addConditionalAttributesOnSelection(writer, true, params.smartfieldId, params.condition, params.value)
  //       }
  //     } else {

  //       // complains about generator being passed
  //       // although works fine
  //       // @ts-ignore
  //       const ranges = model.schema.getValidRanges(selection.getRanges(),
  //       CONDITIONAL
  //       );

  //       for (const range of ranges) {
  //         if(selection.hasAttribute(CONDITIONAL)){
  //           writer.removeAttribute(CONDITIONAL, range)
  //         } else {
  //           this._addConditionalAttributesOnRange(writer, range, true, params['smartfield-id'], params.condition, params.value)
  //         }
  //       }
  //     }
  //   });
  // }

  _addConditionalAttributesOnSelection(
    writer,
    isMet,
    smartfieldId,
    condition,
    value
  ) {
    writer.setSelectionAttribute(CONDITIONAL, true);
    writer.setSelectionAttribute('smartfield-id', smartfieldId);
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
    writer.setAttribute('smartfield-id', smartfieldId, range);
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
