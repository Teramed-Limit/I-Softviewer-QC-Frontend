export interface FormDef {
    sections: Section[];
}

export interface Section {
    fields: Field[];
}

export interface Field {
    field: string;
    label: string;
}
