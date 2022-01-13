import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import SmartfieldEditing from './SmartfieldEditing.js'
import SmartfieldUi from './components/SmartfieldUi.jsx'

export default class SmartfieldPlugin extends Plugin {
  static get requires() {
    return [SmartfieldEditing, SmartfieldUi]
  }
}
