import React, { Suspense } from 'react'
import Header from '../components/Header'
import MainSpinner from '../components/MainSpinner'
import { Route, Routes } from 'react-router-dom'
import HomeContainer from '../components/HomeContainer'
import CreateTemplate from './CreateTemplate'
import UserProfile from "./UserProfile"
import TemplateDesignPinDetails from "./TemplateDesignPinDetails"
import CreateResume from "./CreateResume"


const HomeScreen = () => {
  return (
    <div className=' w-full flex flex-col items-center justify-center'>
      
      {/* Header */}
      <Header/>
      <main className='w-full'>
        <Suspense fallback = {<MainSpinner/>}>
          <Routes>
            <Route path="/" element={<HomeContainer/>} />
            <Route path="/template/create" element={<CreateTemplate/>} />
            <Route path="/profile/:uid" element={<UserProfile/>} />
            <Route path="/resume/*" element={<CreateResume/>} />
            <Route path="/resumeDetails/:templateID" element={<TemplateDesignPinDetails/>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default HomeScreen