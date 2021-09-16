const path = require('path')
// const urlJoin = require('url-join')
const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const format = require('string-template')
const urljoin = require('url-join')

const CLIENT_URL = 'https://google.com.vn'
const SENDGRID_API_KEY = 'key'

class EmailService {
    confirmRegister (user, token) {
        if (!user) {
            return false
        }

        const url = CLIENT_URL

        return this.send('verify-email.html', user.email, 'Hell - Verify your email address', {
            name: user.email,
            link: urljoin(url, `user/verify-email?email=${user.email}&token=${token}`)
        })
    }

    newUserRegister (user) {
        if (!user) {
            return false
        }

        return this.send('register.html', user.email, 'Welcome to Hell', {
            name: user.email
        })
    }

    async send (templateFile, to, subject, params) {
        sgMail.setApiKey(SENDGRID_API_KEY)
        const stringTemplate = fs.readFileSync(path.join(__dirname, './', 'templates', templateFile), 'utf8')
        const body = format(stringTemplate, params)
        const msg = {
            to,
            from: 'admin@hell.io',
            subject: subject,
            html: body
        }
        return sgMail.send(msg)
    }

    async recoverPassword (user, token) {
        if (!user) {
            return false
        }
        const url = CLIENT_URL

        return this.send('reset-password.html', user.email, 'Reset Your Password', {
            name: user.email,
            link: urljoin(url, `user/reset-password?email=${user.email}&token=${token}`)
        })
    }

    async resetEmailComfirmation (user) {
        if (!user) {
            return false
        }

        return this.send('reset-pw-confirmation.html', user.email, 'Your Password Has Been Updated', {
            name: user.email
        })
    }
}

module.exports = EmailService

const user = ''
const token = 'test'
const url = CLIENT_URL
const emailService = new EmailService()
emailService.send('register.html', user, 'Btc  down', {
    name: user,
    link: urljoin(url, `user/verify-email?email=${user}&token=${token}`)
})