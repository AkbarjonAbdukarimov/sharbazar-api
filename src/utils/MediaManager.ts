import ImageKit from "imagekit";
import NotFoundError from "../Errors/NotFoundError";

export default class MediaManager {
  private static imagekit = new ImageKit({
    publicKey: "public_ezsqfPMMvU+6dKNB1MHpZQbjEiY=",
    privateKey: "private_lX0IVpWziNG3bGoblqm5V3248Gk=",
    urlEndpoint: "https://ik.imagekit.io/z6k3ktb71",
  });
  public static async uploadFile(
    file: Express.Multer.File,
    fileName: string
  ): Promise<{ name: string; fileId: string }> {
    try {
      const temp = file.originalname.split(".");
      fileName = `${fileName}.${temp[temp.length - 1]}`;
      const res = await this.imagekit.upload({
        file: file.buffer.toString("base64"), //required
        fileName, //required
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
    } catch (error) {
      console.log("media manager upload eror", error);
      throw error;
    }
  }
  public static async deletefiles(
    name: string,
    fileId?: string
  ): Promise<Boolean> {
    try {
      if (!fileId) {
        const imgs = await this.imagekit.listFiles({ name });
        if (imgs.length < 1) throw new NotFoundError("Image Not Found");
        fileId = imgs[0].fileId;
      }

      await this.imagekit.deleteFile(fileId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
