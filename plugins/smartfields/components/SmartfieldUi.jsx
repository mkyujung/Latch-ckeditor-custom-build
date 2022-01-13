import './Smartfield.css'

import {
  addListToDropdown,
  createDropdown,
  Model
} from '@ckeditor/ckeditor5-ui'

import { Collection } from '@ckeditor/ckeditor5-utils'
import { Plugin } from '@ckeditor/ckeditor5-core'

export default class SmartfieldUi extends Plugin {
  init() {
    const { editor } = this
    const { t } = editor

    const smartfields = editor.config.get('smartfieldProps.types') || []

    if (!editor.ui) throw 'No EditorUi'
    editor.ui.componentFactory.add('smartfield', (locale) => {
      const dropdownView = createDropdown(locale)

      addListToDropdown(dropdownView, getDropdownItemsDefinitions(smartfields))

      dropdownView.buttonView.set({
        label: t('Smartfield'),
        tooltip: true,
        withText: true
      })

      this.listenTo(dropdownView, 'execute', (evt) => {
        console.log(
          '🚀 ~ file: SmartfieldUi.jsx ~ line 32 ~ SmartfieldUi ~ this.listenTo ~ evt',
          evt
        )
        editor.execute('insert_smartfield', evt.source.commandParam)

        editor.editing.view.focus()
      })

      return dropdownView
    })
  }
}

function getDropdownItemsDefinitions(smartfields) {
  const itemDefinitions = new Collection(
    smartfields.map((s) => ({
      type: 'button',
      model: new Model({
        commandParam: s,
        label: s.title,
        withText: true
      })
    }))
  )

  return itemDefinitions
}
