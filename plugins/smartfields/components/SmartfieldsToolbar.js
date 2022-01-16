import './Smartfield.css';

// Consider changing styling to event driven plugin
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/conversion/conversion-extending-output.html
// So the plugin can be removed for pdf renders
import {
  addListToDropdown,
  createDropdown,
  Model
} from '@ckeditor/ckeditor5-ui';

import { Collection } from '@ckeditor/ckeditor5-utils';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SmartfieldsRepository from '../../smartfields-repository/SmartfieldsRepository';

export default class SmartfielsToolbar extends Plugin {
  static get requires() {
    return [SmartfieldsRepository];
  }

  init() {
    console.log('ui init');
    const { editor } = this;
    const { t } = editor;
    const smartfields =
      editor.config.get('smartfieldProps.initialSmartfields') || [];

    if (!editor.ui) throw 'No EditorUi';

    editor.ui.componentFactory.add('smartfield', (locale) => {
      const dropdownView = createDropdown(locale);

      // Because this is only set on init, it's not getting any new values
      addListToDropdown(dropdownView, getDropdownItemsDefinitions(smartfields));

      dropdownView.buttonView.set({
        label: t('Smartfield'),
        tooltip: true,
        withText: true
      });

      this.listenTo(dropdownView, 'execute', (evt) => {
        editor.execute('insert_smartfield', evt.source.commandParam);

        editor.editing.view.focus();
      });

      return dropdownView;
    });

    const srepo = editor.plugins.get(SmartfieldsRepository.pluginName);
    console.log(
      '🚀 ~ file: SmartfieldsToolbar.js ~ line 52 ~ SmartfielsToolbar ~ init ~ srepo',
      srepo
    );

    srepo.on('change:smartfields', (...params) => console.log('aiya', params));
    // this.listenTo(srepo, 'change:smartfields', (...wtf) =>
    //   console.log('HOHO', wtf)
    // );
  }

  refresh() {
    console.log('log toolbar');
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
  );

  return itemDefinitions;
}
