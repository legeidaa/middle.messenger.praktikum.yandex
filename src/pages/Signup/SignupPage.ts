import { Block } from '@shared/lib/Block'
import { InputField } from '@shared/partials/InputField';
import { Input } from '@shared/partials/Input';
import { Button } from '@shared/partials/Button';
import { Link } from '@shared/partials';
import { SignupForm } from '@widgets/SignupForm';
import { Form } from '@shared/partials/Form';
import { validator } from '@shared/lib/Validator';
import SigninPageTemplate from './SignupPage.hbs?raw';
import { ISignupPageProps } from './model';

export class SignupPage extends Block {
    constructor(props: ISignupPageProps) {
        super(props)
    }

    render() {
        return this.compile(SigninPageTemplate, this.props);
    }
}

const inputEmail = new InputField({
    className: 'login-page__input',
    id: 'email',
    label: 'Почта',
    input: new Input({
        type: 'email',
        id: 'email',
        name: 'email',
        className: 'input-field__element',
        value: 'pochta@yandex.ru',
        events: {
            blur: validateEmail,
        },
    }),
})

const inputLogin = new InputField({
    className: 'login-page__input',
    id: 'login',
    label: 'Логин',
    input: new Input({
        type: 'text',
        id: 'login',
        name: 'login',
        className: 'input-field__element',
        value: 'somelogin',
        events: {
            blur: validateLogin,
        },
    }),
})

const inputFirstName = new InputField({
    className: 'login-page__input',
    id: 'first_name',
    label: 'Имя',
    input: new Input({
        type: 'text',
        id: 'first_name',
        name: 'first_name',
        className: 'input-field__element',
        value: '',
        events: {
            blur: validateName,
        },
    }),
})

const inputSecondName = new InputField({
    className: 'login-page__input',
    id: 'second_name',
    label: 'Фамилия',
    input: new Input({
        type: 'text',
        id: 'second_name',
        name: 'second_name',
        className: 'input-field__element',
        value: '',
        events: {
            blur: validateSecondName,
        },
    }),
})

const inputPhone = new InputField({
    className: 'login-page__input',
    id: 'phone',
    label: 'Телефон',
    input: new Input({
        type: 'tel',
        id: 'phone',
        name: 'phone',
        className: 'input-field__element',
        value: '',
        events: {
            blur: validatePhone,
        },
    }),
})

const inputPassword = new InputField({
    className: 'login-page__input',
    id: 'password',
    error: ' ',
    label: 'Пароль',
    input: new Input({
        type: 'password',
        id: 'password',
        name: 'password',
        className: 'input-field__element',
        value: '123',
        events: {
            blur: validatePassword,
        },
    }),
})

const inputPasswordRepeat = new InputField({
    className: 'login-page__input',
    id: 'password_repeat',
    error: 'Пароли не совпадают',
    label: 'Пароль (ещё раз)',
    input: new Input({
        type: 'password',
        id: 'password_repeat',
        name: 'password_repeat',
        className: 'input-field__element',
        value: '123',
        events: {
            blur: validateComparePassword,
        },
    }),
})

const footerButtonSubmit = new Button({
    text: 'Зарегистрироваться',
    type: 'submit',
    className: 'login-form__submit-btn',
})

const footerLinkSignin = new Link({
    text: 'Войти',
    href: '#signin',
    className: 'login-form__link',
})

const signupForm = new SignupForm({
    inputEmail,
    inputLogin,
    inputFirstName,
    inputSecondName,
    inputPhone,
    inputPassword,
    inputPasswordRepeat,
    footerButtonSubmit,
    footerLinkSignin,
})

const form = new Form({
    formContent: signupForm,
    className: 'login-form login-form_signup',
    events: {
        submit: (e) => {
            validateSubmit(e)
        },
    },
})

function validateEmail(e: Event) {
    e.preventDefault()
    const input = inputEmail.children.input.getContent() as HTMLInputElement
    const result = validator.checkEmail(input.value)

    if (typeof result === 'string') {
        inputEmail.setProps({ error: result })
        return false
    }
    inputEmail.setProps({ error: '' })
    return true
}

function validateLogin(e: Event) {
    e.preventDefault()
    const input = inputLogin.children.input.getContent() as HTMLInputElement
    const result = validator.checkLogin(input.value)

    if (typeof result === 'string') {
        inputLogin.setProps({ error: result })
        return false
    }
    inputLogin.setProps({ error: '' })
    return true
}

function validateName(e: Event) {
    e.preventDefault()
    const input = inputFirstName.children.input.getContent() as HTMLInputElement
    const result = validator.checkName(input.value)

    if (typeof result === 'string') {
        inputFirstName.setProps({ error: result })
        return false
    }
    inputFirstName.setProps({ error: '' })
    return true
}

function validateSecondName(e: Event) {
    e.preventDefault()
    const input = inputSecondName.children.input.getContent() as HTMLInputElement
    const result = validator.checkName(input.value)

    if (typeof result === 'string') {
        inputSecondName.setProps({ error: result })
        return false
    }
    inputSecondName.setProps({ error: '' })
    return true
}

function validatePhone(e: Event) {
    e.preventDefault()
    const input = inputPhone.children.input.getContent() as HTMLInputElement
    const result = validator.checkPhone(input.value)

    if (typeof result === 'string') {
        inputPhone.setProps({ error: result })
        return false
    }
    inputPhone.setProps({ error: '' })
    return true
}
function validatePassword(e: Event) {
    e.preventDefault()
    const input = inputPassword.children.input.getContent() as HTMLInputElement
    const result = validator.checkPassword(input.value)

    if (typeof result === 'string') {
        inputPassword.setProps({ error: result })
        return false
    }
    inputPassword.setProps({ error: '' })

    return true
}

function validateComparePassword(e: Event) {
    const passInput = inputPassword.children.input.getContent() as HTMLInputElement
    const passInputRepeat = inputPasswordRepeat.children.input.getContent() as HTMLInputElement

    const result = validator.comparePasswords(passInput.value, passInputRepeat.value)

    if (typeof result === 'string') {
        inputPasswordRepeat.setProps({ error: result })
        return false
    }
    inputPasswordRepeat.setProps({ error: '' })

    return true
}

function validateSubmit(e: Event) {
    e.preventDefault()

    if (
        validateEmail(e)
        && validateLogin(e)
        && validateName(e)
        && validateSecondName(e)
        && validatePhone(e)
        && validatePassword(e)
        && validateComparePassword(e)
    ) {
        window.location.hash = 'chat'
    }
}

export const signupPage = new SignupPage({
    form,
})
