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



  const handleClick = async () => {
    try {
      // Cloudinary upload server action
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

      {/* Cloudinary sample image preview section */}
      <section>
        {
          <CldImage
            width="600"
            height="400"
            src={"pbrnzh1otdbgtezwhkge"} // public_id from Cloudinary response
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