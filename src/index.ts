import express, { Request, Response } from 'express'
import 'dotenv/config'
import { uploadFile, getImage, delImg, getObjects } from './AwsS3'
import { sendMsg, receiveMsg } from './AwsSQS'

const app = express()

app.get('/', (req, res) => {
    res.send('AWS app is running...')
})

// S3 routes

app.get('/s3', async (req: Request, res: Response) => {
    const result = await getObjects()
    // console.log('results from index -->', result?.Contents)

    let arr = ''

    result?.Contents?.forEach((obj) => {
        // console.log('Key from foreach ---->', obj)
        arr = `${arr} - ${obj.Key}`
    })

    res.send(`
        <div>
            <h1>Welcome to AWS-S3 Hands On!!!</h1>
            ${arr ? arr : null}
        </div>
    `)
})

app.post('/s3/upload', async (req: Request, res: Response) => {
    console.log('Uploading a file to AWS S3...')

    const result = await uploadFile()
    console.log('upload result -->', result)

    res.send(result)
})

app.post('/s3/delete', async (req: Request, res: Response) => {
    const key = process.env.AWS_FILE_KEY
    if (key) {
        const result = await delImg(key)
        res.send(result)
    } else {
        res.send('failed to get image')
    }
})

// app.get('/s3/image', async (req: Request, res: Response) => {
//     const key = process.env.AWS_FILE_KEY
//     if (key) {
//         // const readStream = await getImage(key)
//         // readStream.pipe(res)
//         console.log('readStream -->')
//     } else {
//         res.send('failed to get image')
//     }
// })

// SQS routes
app.post('/sqs/send', async (req: Request, res: Response) => {
    const result = await sendMsg()
    res.send(`
        <div>
            <h1>Welcome to AWS-SQS Hands On!!!</h1>
            ${result}    
        </div>
    `)
})

app.get('/sqs/receive', async (req: Request, res: Response) => {
    const result: any = await receiveMsg()

    res.send(`Received Message --> ${result?.Messages[0].Body}`)
})

app.listen(3000, () => {
    console.log('listeing on port 3000')
})
