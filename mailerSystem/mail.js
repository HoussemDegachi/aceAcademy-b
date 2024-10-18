import { transporter } from "./index.js"

export default class Mail {
    constructor() {
        this.isTo = false
        this.isSubject = false
        this.isContent = false

        this.info = {
            from: `"Ace-academy" ${process.env.MAILER_EMAIL}`,
        }
    }

    to(to) {
        if (!this.isTo) {
            this.info.to = to
        }
        this.isTo = true
        return this
    }

    subject(subject) {
        if (!this.isSubject) {
            this.info.subject = subject
        }
        this.isSubject = true
        return this
    }

    text(text) {
        if (!this.isContent) {
            this.info.text = text
        } 
        this.isContent = true
        return this
    }

    html(html) {
        if (!this.isContent) {
            this.info.html = html
        } 
        this.isContent = true
        return this 
    }

    async send() {
        if (this.isTo && this.isContent && this.isSubject) {
            const resultData = await transporter.sendMail(this.info)
            return resultData.messageId
        } else {
            throw new Error("Some required fields are missing")
        }
    }
}