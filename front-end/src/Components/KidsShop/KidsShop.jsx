import React, { useState } from 'react'
import { KidsCollection } from '../../DummyData/KidsCollection'
import { images } from '../../assets/Images'

import CustomBtn from '../CustomBtn'
import { useNavigate } from 'react-router-dom'
import KidsShopCard from '../Cards/KidsShopCard'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
const KidsShop = () => {

    const ShowItems = 4;
    const [currentIndexNo, setCurrentIndexNo] = useState(0)
    const [direction, setDirection] = useState("")
    const [hoveredIndex, setHoveredIndex] = useState("");
    const nextCollection = () => {
        if (currentIndexNo + ShowItems < KidsCollection.length) {
            setDirection("next")
            setCurrentIndexNo(currentIndexNo + 1)
        }
    }
    const prevCollection = () => {
        if (currentIndexNo > 0) {
            setDirection("prev")
            setCurrentIndexNo(currentIndexNo - 1)
        }
    }

    const Navigate = useNavigate();
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7cw] lg:px=[9vw] py-4">
            {/* kids shop banner images */}
            <div className='py2 md:py-6'>
                <div className="row-auto">

                    <div className='flex flex-col md:flex-row md:columns-2 items-center'>
                        <div className="hidden md:block w-[50%] px-10 md:px-20 py-5 md:py-10 my-3
                         md:my-5 relative">
                            <img className="kidimg kidimg-1 absolute -top-40" src={images.Kids} alt="" />
                            <img className="kidimg kidimg-2 absolute -top-40" src={images.KidsCloths} alt="" />
                        </div>
                        <div className="flex flex-col w-[100%] md:w-[50%] px-10 md:px-20 py-5 md:py-10 my-3 md:my-5">
                            <div className="imagination-fonts my-4">
                                Imagination Meets Fun!
                            </div>
                            <div className="wonderland-fonts my-10">
                                Wonderland Kids Collection
                            </div>
                            <div className="wonderland-small-fonts my-5">
                                Welcome to Hungree Kids Collection,
                                where magic awaits! Explore our curated collection of clothing,
                                toys and accessories
                                designed to spark creativity and endless fun.
                                Come and discover the wonder today!
                            </div>
                            <div className="flex flex-row my-3">
                                <CustomBtn className={"btn-dark"} onClickFun={() => { Navigate("/kids-shop") }} text={"Shop Now"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* this section is for sliding kids  shop images */}

            <div className="row-auto">
                <div className="text-center">
                    <div className="flex flex-row items-center justify-center text-darkColor">
                        <span>
                            <GoChevronLeft style={{ cursor: "pointer" }}
                                onClick={prevCollection}
                                className={`${currentIndexNo === 0 ? "hidden" : ""}`}
                            />
                        </span>
                        <p className='text-center m-4'> Top Kids Arrivals</p>
                        <span>
                            <GoChevronRight style={{ cursor: "pointer" }}
                                onClick={nextCollection}
                                className={`${currentIndexNo + ShowItems >= KidsCollection.length ? "hidden" : ""}`}
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center relative overflow-hidden">
                <section className='px-4 sm:px-[5vw] md:px-[7cw] gl:px=[9vw]'>
                    <div className='py2 md:py-6 '>
                        <div className="flex flex-wrap justify-center">
                            <div className="flex flex-col md:flex-row md:columns-2  transition-transform duration-700 ease-in-out">
                                {
                                    KidsCollection.slice(currentIndexNo, currentIndexNo + ShowItems).map((item) => (
                                        <div key={item._id}>
                                            <KidsShopCard
                                                classes={''}
                                                onmouseEnter={() => setHoveredIndex(item._id)}
                                                onmouseOut={() => setHoveredIndex(null)}
                                                image={hoveredIndex === item._id ? item.images[1] : item.images[0]}
                                            title={item.name}
                                            price={item.price}
                                            />
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="flex flex-row my-3 ">

                <div className="hidden md:flex items-center m-auto">
                    <CustomBtn className={"btn-light"} onClickFun={() => { Navigate("/kids-shop") }} text={"View All"} />
                </div>
            </div>
        </div>
    )
}

export default KidsShop