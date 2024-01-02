import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners';
import { FaTrash, FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase';

const CreateTemplate = () => {
    const [formData, setFormData] = useState({
      title: "",
      imageURL: null,
    });
    const [imageAsset, setimageAsset] = useState({
      isImageLoading: false,
      uri: null,
      progress: 0
    })

    // handling the input change
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({...prevRec, [name]: value}));
    }

    const handleFileChange = async (e) => {
      setimageAsset((prev) => ({...prev, isImageLoading: true}));
      const file = e.target.files[0];

      if(file && isAllowed(file)){
        const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
        (snapshot)=>{
          setimageAsset((prevAsset) => ({...prevAsset, progress : 
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }))
        }, 
        (error)=> {
          if(error.message.includes("storage/unauthorized")){
            toast.error(`Error : Authorization Revoked`);
          }else{
             toast.error(`Error : ${error.message}`);
          }
        },
        ()=>{
           getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              setimageAsset((prevAsset) => ({
                ...prevAsset,
                uri: downloadURL, 
              }))
           });
           toast.success('Image uploaded');
           setInterval(() => {
              setimageAsset((prev) => ({...prev, isImageLoading: false}));
           },2000)
        }
        )

      }else{
         toast.info("Invalid File Format");
      }
    }


   // action to delete the image from the cloud
    const deleteImageObject = () => {
      const deleteRef = ref(storage, imageAsset.uri);
      deleteObject.apply(deleteRef).then(()=>{
          toast.success('Image removed');
          setInterval(() => {
            setimageAsset((prev) => ({
              ...prev, 
              progress: 0,
              uri: null
            }));
          },2000);
       })
    }

    const isAllowed = (file) => {
      const isAllowedTypes = [ "image/jpeg", "image/jpg", "image/png" ];
      return isAllowedTypes.includes(file.type);
    }

  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1
    lg:grid-cols-12'>

      {/*  Left container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1
      flex items-center justify-start flex-col gap-4 px-2' >
        <div className='w-full'>
          <p className='text-lg text-txtPrimary'>Create a New Template</p>
        </div>

        {/* template Id section */}
        <div className='w-full flex items-center justify-end'>
          <p className='text-base text-txtLight uppercase font-semibold'>
          TempID : {" "}
          </p>
          <p className='text-sm text-txtDark capitalize font-bold'>
          Template1
          </p>
        </div>

        {/* template title section */}
        <input 
          className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg
          text-txtPrimary focus:text-txtDark focus:shadow-md outline-none'
          type="text"
          name='title'
          placeholder='Template Title'
          value={formData.title}
          onChange={handleInputChange} />

        {/* file uploader section */}
        <div className='w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px]
          rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex justify-center items-center'>
            {
              imageAsset.isImageLoading ? 
              (
              <>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <PuffLoader color='#498FCD' size={40} />
                    <p>{imageAsset?.progress.toFixed(2)}%</p>
                </div>
              </>
              ) :
              (
                <>
                  {
                    !imageAsset?.uri ?
                     (
                       <>
                         <label htmlFor="fileSelect" className='w-full h-full cursor-pointer'>
                            <div className='flex flex-col items-center justify-center h-full w-full'>
                              <div className='flex items-center justify-center cursor-pointer flex-col'>
                                 <FaUpload className='text-xl ' />
                                <p className='text-lg text-txtLight gap-3'>
                                  Click to upload
                                </p>
                              </div>
                            </div>
                            <input 
                                type="file"
                                id='fileSelect'
                                className='w-0 h-0' 
                                accept='.jpg,.jpeg,.png'
                                onChange={handleFileChange}
                             />
                         </label>
                       </>
                      ) :
                     (
                       <>
                        <div className='relative rounded-md w-full h-full overflow-hidden'>
                          <img 
                            src={imageAsset?.uri} 
                            className='w-full h-full object-cover' 
                            loading='lazy' 
                            alt="" 
                          />

                          {/* delete action */}
                          <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex
                           items-center justify-center bg-red-500 cursor-pointer'
                           onClick={deleteImageObject}
                           >
                              <FaTrash className="text-sm text-white" />
                          </div>

                        </div>
                       </>
                      )
                  }
                </>
              )
            }
        </div>
      </div>

      {/* Right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9' >
        2
        </div>
    </div>
  )
}

export default CreateTemplate