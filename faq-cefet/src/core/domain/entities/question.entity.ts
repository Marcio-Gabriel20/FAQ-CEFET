export class Question {
    constructor(
        public readonly id: string,
        public title: string,
        public content: string,
        public userId: string,
    ) {}
}