import CheckboxEdit from './CheckboxEdit/CheckboxEdit';
import MultiSelect from './MultiSelect/MultiSelect';
import NumberEdit from './NumberEdit/NumberEdit';
import TextareaEdit from './TextareaEdit/TextareaEdit';
import TextEdit from './TextEdit/TextEdit';

export const EditorMapper = {
    Text: TextEdit,
    Number: NumberEdit,
    Textarea: TextareaEdit,
    Checkbox: CheckboxEdit,
    MultiSelect,
};
