package emailService

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"math/big"
	"net/smtp"
	"text/template"
)

type Config struct {
	Adr            string
	Port           string
	SenderEmail    string
	SenderPassword string
	CodeLength     int
}

type emailData struct {
	ConfirmationCode string
}

type EmailService struct {
	config         Config
	getConfirmCode getConfirmCode
	setConfirmCode setConfirmCode
}

func New(
	config Config,
	getConfirmCode getConfirmCode,
	setConfirmCode setConfirmCode,
) *EmailService {
	return &EmailService{
		config:         config,
		getConfirmCode: getConfirmCode,
		setConfirmCode: setConfirmCode,
	}
}

func (e *EmailService) SendConfirmCode(userEmail string) error {
	code := generateRandomString(e.config.CodeLength)

	data := emailData{ConfirmationCode: code}

	const emailTemplate = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Подтверждение email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
            }
            .code {
                display: inline-block;
                padding: 10px 15px;
                font-size: 24px;
                font-weight: bold;
                color: white;
                background-color: #4CAF50;
                border-radius: 5px;
                margin: 20px 0;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            footer {
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Здравствуйте!</h2>
            <p>Ваш код подтверждения:</p>
            <div class="code">{{.ConfirmationCode}}</div>
            <p>Пожалуйста, введите этот код для подтверждения вашего email.</p>
            <p>Если это не вы пытаетесь зарегистрироваться на сайте под этой почтой, то проигнорируйте это сообщение</p>
            <p>Если у вас возникли вопросы, не стесняйтесь обращаться к нам.</p>
            <footer>
                <p>С уважением,<br>Ваша команда</p>
            </footer>
        </div>
    </body>
    </html>
    `

	t, err := template.New("email").Parse(emailTemplate)
	if err != nil {
		es.logger.Error("[SendConfirmCode] can not parse template", zap.Error(err))
		return err
	}

	body := bytes.Buffer{}
	err = t.Execute(&body, data)
	if err != nil {
		es.logger.Error("[SendConfirmCode] can not execute template to data", zap.Error(err))
		return err
	}

	subject := "Подтверждение вашего email"
	msg := []byte("To: " + userEmail + "\r\n" +
		"From: " + es.config.SenderEmail + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"\r\n" +
		body.String() + "\r\n")

	err = es.setConfirmCode.SetConfirmCode(userEmail, code)
	if err != nil {
		es.logger.Error("[SendConfirmCode] can not send confirm code", zap.Error(err))
		return err
	}

	err = smtp.SendMail(fmt.Sprintf("%s:%s", es.config.Adr, es.config.Port), *es.auth, es.config.SenderEmail, []string{userEmail}, msg)
	if err != nil {
		es.logger.Error("[SendConfirmCode] can not send email", zap.Error(err))
		return err
	}

	return nil

}

func generateRandomString(length int) string {
	chars := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	var result string
	for i := 0; i < length; i++ {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(chars))))
		result += string(chars[n.Int64()])
	}
}
