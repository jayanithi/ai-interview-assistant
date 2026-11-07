from twilio.rest import Client

ACCOUNT_SID = 'YOUR_TWILIO_SID'
AUTH_TOKEN = 'YOUR_TWILIO_TOKEN'
TWILIO_PHONE = '+1234567890'

client = Client(ACCOUNT_SID, AUTH_TOKEN)


def send_otp(phone, otp):

    message = client.messages.create(
        body=f'Your OTP is {otp}',
        from_=TWILIO_PHONE,
        to=phone    )

    return message.sid