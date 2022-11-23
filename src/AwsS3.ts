import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsCommand
} from '@aws-sdk/client-s3'
import { s3Client } from './libs/s3Client'
import fs from 'fs'
import 'dotenv/config'

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION

// create obj and upload it

export async function uploadFile() {
    // const fileStream2 = fs.createReadStream(__dirname + '/imgs/demo.html')

    // console.log('createReadStream ---------------------->', fileStream2)

    const fileStream = fs.readFileSync(__dirname + '/imgs/demo.html')

    console.log('readFileSync ---------------------->', fileStream)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: process.env.AWS_FILE_KEY
    }

    try {
        const results = await s3Client.send(new PutObjectCommand(uploadParams))

        console.log(
            'Successfully created ' +
                uploadParams.Key +
                ' and uploaded it to ' +
                bucketName +
                '/' +
                uploadParams.Key
        )
        return results
    } catch (error) {
        console.log('Error:', error)
    }
}

// get the objects/image
export async function getImage(fileKey: string) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    try {
        // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
        const data: any = await s3Client.send(new GetObjectCommand(downloadParams))
        // Convert the ReadableStream to a string.
        console.log('getImage data --> ' + data.Body)

        // return await data?.Body?.transformToString().createReadStream()
        // return data.Body.createReadStream()
    } catch (err) {
        console.log('Error', err)
    }
}

export async function getObjects() {
    const bucketParams = {
        Bucket: bucketName
    }
    try {
        const data = await s3Client.send(new ListObjectsCommand(bucketParams))
        console.log('getObjects from bucket -->', data)
        return data
    } catch (err) {
        console.log('Error', err)
    }
}

// delete the objects
export async function delImg(fileKey: string) {
    const delParams = {
        Bucket: bucketName,
        Key: fileKey
    }

    try {
        const data = await s3Client.send(new DeleteObjectCommand(delParams))
        console.log(`Object with key ${fileKey} deleted -->`, data)
        return data
    } catch (err) {
        console.log('Error', err)
    }
}
