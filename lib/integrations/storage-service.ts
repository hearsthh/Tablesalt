import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Storage } from "@google-cloud/storage"
import { createClient } from "@/lib/supabase/client"

interface UploadResult {
  url: string
  key: string
  provider: "aws" | "gcp" | "supabase"
}

interface StorageConfig {
  provider: "aws" | "gcp" | "supabase"
  aws?: {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
  }
  gcp?: {
    projectId: string
    keyFilename: string
    bucket: string
  }
}

class StorageService {
  private config: StorageConfig
  private s3Client?: S3Client
  private gcpStorage?: Storage
  private supabase = createClient()

  constructor() {
    this.config = this.initializeConfig()
    this.initializeProviders()
  }

  private initializeConfig(): StorageConfig {
    // Determine provider based on available environment variables
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      return {
        provider: "aws",
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION || "us-east-1",
          bucket: process.env.AWS_S3_BUCKET || "tablesalt-uploads",
        },
      }
    } else if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_KEY_FILE) {
      return {
        provider: "gcp",
        gcp: {
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
          bucket: process.env.GOOGLE_CLOUD_BUCKET || "tablesalt-uploads",
        },
      }
    } else {
      return { provider: "supabase" }
    }
  }

  private initializeProviders(): void {
    if (this.config.provider === "aws" && this.config.aws) {
      this.s3Client = new S3Client({
        region: this.config.aws.region,
        credentials: {
          accessKeyId: this.config.aws.accessKeyId,
          secretAccessKey: this.config.aws.secretAccessKey,
        },
      })
    } else if (this.config.provider === "gcp" && this.config.gcp) {
      this.gcpStorage = new Storage({
        projectId: this.config.gcp.projectId,
        keyFilename: this.config.gcp.keyFilename,
      })
    }
  }

  async uploadFile(file: File | Buffer, key: string, contentType?: string): Promise<UploadResult> {
    try {
      switch (this.config.provider) {
        case "aws":
          return await this.uploadToAWS(file, key, contentType)
        case "gcp":
          return await this.uploadToGCP(file, key, contentType)
        case "supabase":
        default:
          return await this.uploadToSupabase(file, key, contentType)
      }
    } catch (error) {
      console.error("Storage upload error:", error)
      throw error
    }
  }

  private async uploadToAWS(file: File | Buffer, key: string, contentType?: string): Promise<UploadResult> {
    if (!this.s3Client || !this.config.aws) {
      throw new Error("AWS S3 not configured")
    }

    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    const command = new PutObjectCommand({
      Bucket: this.config.aws.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
    })

    await this.s3Client.send(command)

    return {
      url: `https://${this.config.aws.bucket}.s3.${this.config.aws.region}.amazonaws.com/${key}`,
      key,
      provider: "aws",
    }
  }

  private async uploadToGCP(file: File | Buffer, key: string, contentType?: string): Promise<UploadResult> {
    if (!this.gcpStorage || !this.config.gcp) {
      throw new Error("Google Cloud Storage not configured")
    }

    const bucket = this.gcpStorage.bucket(this.config.gcp.bucket)
    const fileObj = bucket.file(key)

    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    await fileObj.save(buffer, {
      metadata: {
        contentType: contentType || "application/octet-stream",
      },
    })

    return {
      url: `https://storage.googleapis.com/${this.config.gcp.bucket}/${key}`,
      key,
      provider: "gcp",
    }
  }

  private async uploadToSupabase(file: File | Buffer, key: string, contentType?: string): Promise<UploadResult> {
    const { data, error } = await this.supabase.storage.from("uploads").upload(key, file, {
      contentType: contentType || "application/octet-stream",
      upsert: true,
    })

    if (error) {
      throw error
    }

    const { data: urlData } = this.supabase.storage.from("uploads").getPublicUrl(key)

    return {
      url: urlData.publicUrl,
      key,
      provider: "supabase",
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      switch (this.config.provider) {
        case "aws":
          await this.deleteFromAWS(key)
          break
        case "gcp":
          await this.deleteFromGCP(key)
          break
        case "supabase":
        default:
          await this.deleteFromSupabase(key)
          break
      }
    } catch (error) {
      console.error("Storage delete error:", error)
      throw error
    }
  }

  private async deleteFromAWS(key: string): Promise<void> {
    if (!this.s3Client || !this.config.aws) {
      throw new Error("AWS S3 not configured")
    }

    const command = new DeleteObjectCommand({
      Bucket: this.config.aws.bucket,
      Key: key,
    })

    await this.s3Client.send(command)
  }

  private async deleteFromGCP(key: string): Promise<void> {
    if (!this.gcpStorage || !this.config.gcp) {
      throw new Error("Google Cloud Storage not configured")
    }

    const bucket = this.gcpStorage.bucket(this.config.gcp.bucket)
    await bucket.file(key).delete()
  }

  private async deleteFromSupabase(key: string): Promise<void> {
    const { error } = await this.supabase.storage.from("uploads").remove([key])

    if (error) {
      throw error
    }
  }

  async getFileUrl(key: string): Promise<string> {
    switch (this.config.provider) {
      case "aws":
        return `https://${this.config.aws?.bucket}.s3.${this.config.aws?.region}.amazonaws.com/${key}`
      case "gcp":
        return `https://storage.googleapis.com/${this.config.gcp?.bucket}/${key}`
      case "supabase":
      default:
        const { data } = this.supabase.storage.from("uploads").getPublicUrl(key)
        return data.publicUrl
    }
  }
}

export const storageService = new StorageService()
export default storageService
