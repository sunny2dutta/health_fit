export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface Action {
    type: string;
    value: string;
    url: string;
}
