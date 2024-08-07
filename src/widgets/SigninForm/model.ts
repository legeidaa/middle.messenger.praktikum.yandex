import { IBlockProps } from '@shared/lib/Block';
import { InputField } from '@shared/partials/InputField';
import { Button } from '@shared/partials/Button';
import { Link } from '@shared/partials';

export interface ISigninFormProps extends IBlockProps {
    error: string,
    inputLogin: InputField;
    inputPassword: InputField;
    footerButtonSubmit: Button;
    footerLinkSignup: Link
}
