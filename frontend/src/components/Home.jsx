import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import Category from './Category'
import LatestJobs from './LatestJobs'
const Home = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Category />
            <LatestJobs />
            {/* <Footer /> */}
        </div>
    )
}

export default Home
