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
    const { editor } = this;
    // const { t } = editor;
    const initialSmartfields =
      editor.config.get('smartfieldProps.initialSmartfields') || [];

    this._createDropdownUi.call(this, editor, initialSmartfields);

    const repository = editor.plugins.get(SmartfieldsRepository.pluginName);

    repository.on(
      'change:smartfields',
      (evt, propertyName, newValue, oldValue) => {
        console.log('change listener');
        this._handleSmartfieldsChanged.bind(this)(newValue);
      }
    );
  }

  refresh() {
    console.log('log toolbar');
  }

  _handleSmartfieldsChanged(smartfields) {
    console.log('handler');
    if (this.dropdownRef) {
      console.log('destroy?', this.dropdownRef);

      // Remove existing dropdown
      this.dropdownRef.panelView.children.clear();

      addListToDropdown(
        this.dropdownRef,
        getDropdownItemsDefinitions(smartfields)
      );
    }
  }

  _createDropdownUi(editor, smartfields) {
    console.log('create');
    const { t } = editor;
    let dropdownRef;

    editor.ui.componentFactory.add('smartfield', (locale) => {
      const dropdownView = createDropdown(locale);
      this.dropdownRef = dropdownView;
      dropdownRef = dropdownView;
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
    console.log('return', dropdownRef);
    return dropdownRef;
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
