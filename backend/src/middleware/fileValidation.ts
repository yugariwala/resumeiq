import multer from 'multer'
import path from 'path'
import { Request } from 'express'

const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const storage = multer.memoryStorage()

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_TYPES.includes(file.mimetype) && ['.pdf', '.docx'].includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Only PDF and DOCX files are accepted.'))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE },
})
