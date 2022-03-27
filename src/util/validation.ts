   //  validation
   export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
export function validate(object: Validatable) {
    let isValid = true;
    if(object.required) {
        isValid = isValid && object.value.toString().trim().length !== 0
    }
    if(object.minLength != null && typeof object.value === 'string') {
        isValid = isValid && object.value.length > object.minLength

    }
    if(object.maxLength != null && typeof object.value === 'string') {
        isValid = isValid && object.value.length < object.maxLength

    }
    if(object.min != null && typeof object.value === 'number') {
        isValid = isValid && object.value > object.min

    }
    if(object.max != null && typeof object.value === 'number') {
        isValid = isValid && object.value < object.max;

    }
    return isValid

}