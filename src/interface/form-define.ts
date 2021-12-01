export interface FormDef {
    sections: Section[];
}

export interface Section {
    fields: Field[];
}

export interface Field {
    type: string;
    field: string;
    label: string;
    readOnly?: boolean;
    validation?: Validation;
}

export interface SelectField extends Field {
    optionSource: OptionSource;
}

export interface OptionSource {
    type: string;
    source: string;
    key: string;
    labelKey: string;
}

export interface Validation {
    type: string;
    params?: any;
}
