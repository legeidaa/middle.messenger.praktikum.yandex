
export { default as MainPage } from './MainPage.hbs?raw';
import Handlebars from 'handlebars';

Handlebars.registerHelper('links-to-pages', () => {
    return [
        { link: '#chat', pageName: 'Чат', },
        { link: '#login', pageName: 'Логин' },
    ]
});