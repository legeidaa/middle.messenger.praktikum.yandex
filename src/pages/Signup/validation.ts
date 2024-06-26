import { validator } from '@shared/lib/Validator'
import { validateHelper } from '@shared/utils/validateHelper'
import { inputEmail, inputFirstName, inputLogin, inputPassword, inputPasswordRepeat, inputPhone, inputSecondName } from './SignupPage'

export function validateEmail(e: Event) {
    e.preventDefault()
    const input = inputEmail.children.input.getContent() as HTMLInputElement
    const result = validator.checkEmail(input.value)

    return validateHelper(inputEmail, result)
}

export function validateLogin(e: Event) {
    e.preventDefault()
    const input = inputLogin.children.input.getContent() as HTMLInputElement
    const result = validator.checkLogin(input.value)

    return validateHelper(inputLogin, result)
}

export function validateName(e?: Event) {
    if (e) {
        e.preventDefault()
    }

    const input = inputFirstName.children.input.getContent() as HTMLInputElement
    const result = validator.checkName(input.value)

    return validateHelper(inputFirstName, result)
}

export function validateSecondName(e: Event) {
    e.preventDefault()
    const input = inputSecondName.children.input.getContent() as HTMLInputElement
    const result = validator.checkName(input.value)

    return validateHelper(inputSecondName, result)
}

export function validatePhone(e: Event) {
    e.preventDefault()
    const input = inputPhone.children.input.getContent() as HTMLInputElement
    const result = validator.checkPhone(input.value)

    return validateHelper(inputPhone, result)
}
export function validatePassword(e: Event) {
    e.preventDefault()
    const input = inputPassword.children.input.getContent() as HTMLInputElement
    const result = validator.checkPassword(input.value)

    return validateHelper(inputPassword, result)
}

export function validateComparePassword(e: Event) {
    const passInput = inputPassword.children.input.getContent() as HTMLInputElement
    const passInputRepeat = inputPasswordRepeat.children.input.getContent() as HTMLInputElement

    const result = validator.comparePasswords(passInput.value, passInputRepeat.value)

    return validateHelper(inputPasswordRepeat, result)
}

export function validateSubmit(e: Event) {
    const data = new FormData(e.target as HTMLFormElement)
    const formDataObj = Object.fromEntries(data.entries())
    console.log(formDataObj)

    e.preventDefault()

    validateEmail(e)
    validateLogin(e)
    validateName()
    validateSecondName(e)
    validatePhone(e)
    validatePassword(e)
    validateComparePassword(e)

    const isValid = validateEmail(e)
        && validateLogin(e)
        && validateName()
        && validateSecondName(e)
        && validatePhone(e)
        && validatePassword(e)
        && validateComparePassword(e)

    if (isValid) {
        window.location.hash = 'chat'
    }
}