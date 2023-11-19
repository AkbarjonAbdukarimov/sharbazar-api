"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const NotFoundError_1 = __importDefault(require("../Errors/NotFoundError"));
class MediaManager {
    static uploadFile(file, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const temp = file.originalname.split(".");
                fileName = `${fileName}.${temp[temp.length - 1]}`;
                const res = yield this.imagekit.upload({
                    file: file.buffer.toString("base64"),
                    fileName,
                    useUniqueFileName: false,
                    extensions: [
                        {
                            name: "google-auto-tagging",
                            maxTags: 5,
                            minConfidence: 95,
                        },
                    ],
                });
                return res;
            }
            catch (error) {
                console.log("media manager upload eror", error);
                throw error;
            }
        });
    }
    static deletefiles(name, fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileId) {
                    const imgs = yield this.imagekit.listFiles({ name });
                    if (imgs.length < 1)
                        throw new NotFoundError_1.default("Image Not Found");
                    fileId = imgs[0].fileId;
                }
                yield this.imagekit.deleteFile(fileId);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
MediaManager.imagekit = new imagekit_1.default({
    publicKey: "public_ezsqfPMMvU+6dKNB1MHpZQbjEiY=",
    privateKey: "private_lX0IVpWziNG3bGoblqm5V3248Gk=",
    urlEndpoint: "https://ik.imagekit.io/z6k3ktb71",
});
exports.default = MediaManager;
