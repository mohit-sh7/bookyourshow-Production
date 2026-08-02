import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-20 w-full text-gray-300">
      <div className="glass-card flex flex-col md:flex-row justify-between w-full gap-8 border-transparent p-8 rounded-2xl">
        <div className="md:max-w-96">
            <img className="w-36 h-auto" src={assets.logo} alt="logo" />
            <p className="mt-4 text-sm text-gray-300">
                The best place to discover, watch and book your next cinema experience — wrapped in neon glass.
            </p>
            <div className="flex items-center gap-2 mt-4">
                <img src={assets.googlePlay} alt="google play" className="h-9 w-auto" />
                <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
            </div>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-12 md:gap-24">
            <div>
                <h2 className="font-semibold mb-4 text-sm">Company</h2>
                <ul className="text-sm space-y-2">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 className="font-semibold mb-4 text-sm">Get in touch</h2>
                <div className="text-sm space-y-2">
                    <p>+1-234-567-890</p>
                    <p>contact@example.com</p>
                </div>
            </div>
        </div>
      </div>

      <p className="pt-4 text-center text-sm pb-5 text-gray-400">
          Copyright {new Date().getFullYear()} © GreatStack. All Right Reserved.
      </p>
    </footer>
  )
}

export default Footer
