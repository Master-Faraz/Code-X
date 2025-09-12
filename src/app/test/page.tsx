"use client"
import { CldImage } from 'next-cloudinary';
// import env from '../env';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import uploadImage from '@/actions/imageUploader.action';
import { useState } from 'react';
import { HttpError } from '@/utils/httpError';
import { ImageSizeKey } from '@/constants/imageUploaderConstants';

const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [test, setTest] = useState()

  const obj = {
    "asset_id": "4f466b463fb7a16788208e15b12f662f",
    "public_id": "tyreof5cwt2dc2vum9xn",
    "version": 1757575723,
    "version_id": "ad7d9e3840e54ef835a254e09adc6599",
    "signature": "1d2a6984498d057db606ab721f5efcad064f57de",
    "width": 3072,
    "height": 1728,
    "format": "png",
    "resource_type": "image",
    "created_at": "2025-09-11T07:28:43Z",
    "tags": [
      "test"
    ],
    "bytes": 2295493,
    "type": "upload",
    "etag": "3bed9112b1431db0fc0c268682f9c84c",
    "placeholder": false,
    "url": "http://res.cloudinary.com/dbwrc92iv/image/upload/v1757575723/tyreof5cwt2dc2vum9xn.png",
    "secure_url": "https://res.cloudinary.com/dbwrc92iv/image/upload/v1757575723/tyreof5cwt2dc2vum9xn.png",
    "asset_folder": "",
    "display_name": "tyreof5cwt2dc2vum9xn",
    "original_filename": "file",
    "api_key": "672991385393269"
  }


  const handleClick = async () => {
    try {
      const result = await uploadImage({ file: file, sizeKeys: [ImageSizeKey.CARD] })
      setTest(result?.public_id!)
      console.log(result)
    } catch (err: any) {
      if (err instanceof HttpError) {
        console.error('Upload failed:', err.status, err.message);
      } else {
        console.error('Upload failed:', err.http_code, " \t ", err.message,);
      }
    }
  }

  return (
    <main className='h-screen w-full flex flex-col items-center justify-center'>
      <section> Test app</section>


      <section>
        {/* <CldUploadButton uploadPreset="<Upload Preset>" /> */}
        {/* <CldUploadWidget uploadPreset={env.cloudinary.uploadPreset}>
          {({ open }) => (
            <button onClick={() => open()}>
              Test Upload
            </button>
          )}
        </CldUploadWidget> */}
        <Input type='file' placeholder='Select File' className='bg-amber-300' onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }} />
        <Button variant={'default'} onClick={handleClick}> upload image</Button>

      </section>

      <section>
        {test &&
          <CldImage
            width="600"
            height="400"
            src={test} // public_id from Cloudinary response
            alt="Uploaded image"
            crop="fill"
            gravity="auto"
            quality="auto"
            format="auto"
            dpr="auto"
            // placeholder="blur"
            loading="lazy"
          />}

        {/* Responsive */}
        {/* <CldImage
  publicId={public_id}
  width="auto"
  crop="scale"
  responsive
  alt="Example"
/> */}
      </section>
    </main>
  )
}

export default page