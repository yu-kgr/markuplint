export declare type Message = (messageTmpl: string, ...keywords: string[]) => string;
export interface LocaleSet {
    locale: string;
    keywords: LocalesKeywords;
    [messageId: string]: string | void | LocalesKeywords;
}
export interface LocalesKeywords {
    [messageId: string]: string | void;
}
export default class Messenger {
    private static _singleton;
    static create(localeSet: LocaleSet | null): Promise<Messenger>;
    localeSet: LocaleSet | null;
    private constructor();
    message(): Message;
}