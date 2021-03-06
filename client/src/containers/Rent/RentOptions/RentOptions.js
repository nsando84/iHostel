import React, { useEffect, useState, useContext } from 'react'
import UserContext from '../../../contexts/UserContext'
import { v4 } from 'uuid';
import axios from 'axios';

const RentOptions = (props) => {
    const { userData } = useContext(UserContext)
    const { title, price, description, images, userName, capacity, _id } = props.hostData
    const authToken = localStorage.getItem('auth-token')
    const [ otherUsers, setOtherUsers ] = useState('')
 
    useEffect(() => {
            runRoommates()
    }, [])

        const runRoommates = () => {
            axios({
                method: 'GET',
                url: `/users/find/`, 
                params: {_id, day: props.todaysDate},
                headers: {
                    'x-auth-token': authToken
                } 
            })
            .then(async response => {
                let userInfo = []
                await response.data.forEach(e => {
                    userInfo.push([e.userName, e.images])
                })
                setOtherUsers(userInfo)
            })
            .catch(error => {
                console.log(error)
            })   
        }
       
        if (otherUsers.length === 0) {
                runRoommates()       
        }
            
   
        const cancelBooking = async (idOfRoom) => {
            const userWantsToCancel = userData.user.id  
            await axios({
                method: 'PUT',
                url: `/users/rent/add/${userWantsToCancel}`, 
                data: {
                    roomId: idOfRoom,
                    date: props.todaysDate
                },
                headers: {
                    'x-auth-token': authToken
                } 
            })
            .then(() => {
                props.setUserHasBooked(false)
                props.userSaysNo(idOfRoom)
            })
            .catch(error => {
                console.log(error)
            })
        }
    
    return (
        <div>
            <h4>Booked for: <span>{props.todaysDate} </span>at $<span>{price} !</span></h4>
            <div ><h5>{title}</h5></div>
            <div className="text-right"><span style={{'color': "#1F6284"}}>Presented By: </span>{userName[0].toUpperCase() + userName.slice(1)}</div>
            {images.map((image, index) => {      
                            if (index === 0) {
                          
                                return (
                                  <div key={v4()}>
                                <div className='main-image-container-rent d-block mt-1' id='main-image-src'><img id={v4()} alt="" src={image} /></div>
                                    {images.length > 1 && <span  style={{fontSize: '11px'}}>click thumbnails to see in main window</span>}
                                    </div>
                                    
                                )
                            } else {

                                let smallImageContainer = v4()
                        
                                return (
                               
                                <div key={v4()} className="d-inline">
                                
                                <div className='small-image-container-rent mx-1 my-1'  id={smallImageContainer}>

                                    <img 
                                        id={v4()}
                                        alt=""
                                        src={image} 
                                        onClick={(e) => {
                                            let mainImage = {
                                                src: document.getElementById('main-image-src').firstElementChild.getAttribute('src'),
                                                id: document.getElementById('main-image-src').firstElementChild.getAttribute('id'),
                                            }
                                            
                                            document.getElementById('main-image-src').firstElementChild.setAttribute('src', `${e.target.src}`)
                                            document.getElementById('main-image-src').firstElementChild.setAttribute('id', `${e.target.id}`)

                                            
                                            document.getElementById(smallImageContainer).lastElementChild.setAttribute('id', mainImage.id)
                                            document.getElementById(smallImageContainer).lastElementChild.setAttribute('src', mainImage.src)
                                            
                                            mainImage = {}              
                                        }}/></div>
                                       </div>
                                )
                            }
                        })}
            <div className="" style={{fontSize: '18px'}}>
            <div className="mt-3 text-left"><span style={{'color': "#1F6284"}}>Info:</span> {description}</div>
                <div className="text-left mt-3">
                    <div><span style={{'color': "#1F6284"}}>Roommates ({otherUsers.length} out of {capacity} max):</span></div>
                    <div className="d-flex mx-4" style={{'maxWidth': "70px"}}>
                        {otherUsers ? otherUsers.map((elem, index) => {
                            return (
                                
                                <div style={{width: '100px'}} className="d-block mr-3 mt-3 text-center" key={index}>
                                <div><img alt="avatarofuser" className="border border-secondary" src={elem[1]} style={{height: '60px', borderRadius: '25%'}}/></div>
                                <div>{elem[0]}</div>
                                </div>
                                
                            )
                        })
                        : ''
                        }        
                    </div>
            

                    
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="px-4 btn-warning py-2" 
                        style={{}}
                        onClick={() => { 
                            cancelBooking(_id)
                        }}   
                    >Cancel Booking</button>
                    <button
                        className="px-4 btn-dark py-2" 
                        
                        onClick={() => {
                            const addressFormatted = props.hostData.loc.formattedAddress.split(',')
                            window.open(`http://maps.google.com/maps?q=${addressFormatted[0]},+ ${addressFormatted[2]},+${addressFormatted[3]}`)
                            
                        }}
                    >Directions</button>
                </div>

            </div>
        </div>
    )
}

export default RentOptions