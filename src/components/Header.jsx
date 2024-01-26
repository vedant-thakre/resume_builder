import React, { useState } from 'react'
import useUser from '../hooks/useUser'
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence, motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import { HiLogout} from 'react-icons/hi'
import { fadeInOutOpacity, slideUpDownMenu } from '../animations';
import { auth } from '../config/firebase';
import { useQueryClient } from 'react-query';
import { adimnIds } from '../utils/helper';

const Header = () => {
    const { data, isLoading, isError } = useUser();
    const [isMenu, setisMenu] = useState(false);
    const queryClient = useQueryClient();

    const singOutUser = async () => {
        await auth.signOut().then(() => {
            queryClient.setQueryData("user", null);
        })
    }

  return (
    <header className='w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b
     border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0'>
        {/*  logo */}
        <Link to={"/"}>
            <img src={Logo} className=' w-8 h-auto object-contain' alt="logo" />
         </Link>

        {/* input */}
        <div className='flex-1 border border-gray-300 px-4 py-1 rounded-md
        flex items-center justify-between bg-gray-200'>
            <input type="text" placeholder='Searh here...' 
            className='flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none'/>
        </div>

        {/* profile section */}
        <AnimatePresence>
            { isLoading ? ( <PuffLoader color='#498FCD' size={40} /> 
            ): ( <React.Fragment>
                { data ? 
                <motion.div {...fadeInOutOpacity}
                className='relative' 
                onClick={()=>{ setisMenu(!isMenu)}}>
                    { data?.photoURL ? 
                    <div className='w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer'>
                        <img src={data?.photoURL} 
                        className='w-full h-full object-cover rounded-md'
                        referrerPolicy='no-referrer' alt="" />
                    </div> : 
                    <div className='w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700
                     shadow-md cursor-pointer'>
                        <p className='text-xl font-bold text-white'>{data?.email[0]}</p>
                    </div>
                    }
                    {/* dropdown menu */}
                    <AnimatePresence>
                        { isMenu &&
                        <motion.div
                        {...slideUpDownMenu}
                        className='absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center
                         justify-center gap-3 w-64 pt-5'
                         onMouseLeave={()=>{ setisMenu(false)}}>
                        { data?.photoURL ? 
                            <div className='w-16 h-16 rounded-full relative flex items-center justify-center cursor-pointer'>
                                <img src={data?.photoURL} 
                                className='w-full h-full object-cover rounded-full'
                                referrerPolicy='no-referrer' alt="" 
                                />
                            </div> : 
                            <div className='w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700
                            shadow-md cursor-pointer'>
                                <p className='text-xl font-bold text-white'>{data?.email[0]}</p>
                            </div>
                        }
                         {data?.displayName && 
                        <p className='text-md font-bold text-txtDark'>{data?.displayName}</p>
                        }
                        { /* menu   */  }
                        <div className='w-full flex-col items-start flex gap-4 pt-2'>
                            <Link className='text-base text-txtLight hover:text-txtDark whitespace-nowrap' to={"/profile"}> 
                            My Accound
                            </Link>

                            {
                                adimnIds.includes(data?.uid) && 
                                (<Link className='text-base text-txtLight hover:text-txtDark whitespace-nowrap' to={"/template/create"}> 
                                    Add New Template
                                </Link>)
                            }

                            <div className='w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group'
                            onClick={singOutUser}>
                                <p className=' group-hover:text-txtDark  text-txtLight cursor-pointer'>
                                    Sign Out
                                </p>
                                <HiLogout className=' group-hover:text-txtDark  text-txtLight cursor-pointer'/>
                            </div>
                        </div>
                        </motion.div>}
                    </AnimatePresence>
                </motion.div> :
                <Link to={"/auth"}>
                    <motion.button className='px-4 py-2 rounded-md border border-gray-300
                    hover:shadow-md active:scale-95 duration-150'
                    type='button'
                    {...fadeInOutOpacity}
                    >
                        Login
                    </motion.button>
                </Link>}
            </React.Fragment> )} 
        </AnimatePresence>
    </header>
  )
}

export default Header