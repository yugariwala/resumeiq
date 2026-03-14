"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const storage = multer_1.default.memoryStorage();
function fileFilter(_req, file, cb) {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (ALLOWED_TYPES.includes(file.mimetype) && ['.pdf', '.docx'].includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF and DOCX files are accepted.'));
    }
}
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE },
});
//# sourceMappingURL=fileValidation.js.map