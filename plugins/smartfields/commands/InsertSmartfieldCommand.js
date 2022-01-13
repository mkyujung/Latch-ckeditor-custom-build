import { Command } from '@ckeditor/ckeditor5-core'

export default class InsertSmartfieldCommand extends Command {
  execute(commandParam) {
    this.editor.model.change((writer) => {
      console.log(
        '🚀 ~ file: InsertSmartfieldCommand.js ~ line 8 ~ InsertSmartfieldCommand ~ this.editor.model.change ~ commandParam',
        commandParam
      )
      const smartfield = writer.createElement('smartfield', {
        value: commandParam.value,
        title: commandParam.title
      })

      this.editor.model.insertContent(smartfield)

      writer.setSelection(smartfield, 'on')
    })
  }

  refresh() {
    const { model } = this.editor
    const { selection } = model.document

    const isAllowed = model.schema.checkChild(
      selection.focus.parent,
      'smartfield'
    )

    this.isEnabled = isAllowed
  }
}
