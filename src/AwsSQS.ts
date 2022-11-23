import {
    CreateQueueCommand,
    SendMessageCommand,
    ReceiveMessageCommand,
    GetQueueUrlCommand,
    DeleteQueueCommand
} from '@aws-sdk/client-sqs'
import { sqsClient } from './libs/sqsClient'

const queueName = '01-nodejs-sqs'

export async function sendMsg() {
    const QueueUrl = await getQueueUrl()
    const msgParams = {
        DelaySeconds: 10,
        MessageAttributes: {
            Title: {
                DataType: 'String',
                StringValue: 'Message from smartSense'
            },
            Author: {
                DataType: 'String',
                StringValue: 'Mitrang'
            }
        },
        MessageBody: 'smartSense AWS SQS Hands On',
        QueueUrl: QueueUrl //SQS_QUEUE_URL
    }
    try {
        const data = await sqsClient.send(new SendMessageCommand(msgParams))
        console.log('SQS received data -->', data)
        return data
    } catch (err) {
        console.log('Error', err)
    }
}

export async function getQueueUrl() {
    const params = {
        QueueName: queueName
    }
    let QueueUrl: string | undefined = ''
    try {
        //get queue URL
        const data = await sqsClient.send(new GetQueueUrlCommand(params))
        QueueUrl = data.QueueUrl
        console.log('QueueUrl -->', QueueUrl)
        return QueueUrl
    } catch (err) {
        console.log('Error', err)
    }
}

export async function receiveMsg() {
    const QueueUrl = await getQueueUrl()
    const params = {
        AttributeNames: ['SentTimestamp'],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['All'],
        QueueUrl: QueueUrl,
        WaitTimeSeconds: 20
    }

    try {
        const data = await sqsClient.send(new ReceiveMessageCommand(params))
        console.log('ReceiveMsG data -->, ', data)
        return data
    } catch (err) {
        console.log('Error', err)
    }
}
