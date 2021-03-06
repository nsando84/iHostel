const router = require('express').Router();
const auth = require('../auth/auth');
const User = require('../models/userModel')
const Host = require('../models/hostModel')

router.post('/rent/add/:id', auth, async (req, res) => {
    
    const { roomId, date, rentHistory, userName, images } = req.body
    const userId = req.user
    const querySearch = { _id: userId, [`userBooked.${date}`] : { $exists: true}}
    const queryRoomSearch = { _id: roomId, [`usersYes.${date}`] : { $exists: true}}
    const checkIt = await User.findOne(querySearch)
    const checkRoom = await Host.findOne(queryRoomSearch)
        // if (!checkRoom || checkIt) {
            if (false) {
            console.log('already booked')
            res.json('already booked a day')
        } else {
            
            User.updateOne({ 
                _id: userId
            }, {  $addToSet: {
                    userBooked: {
                        [date]: roomId
                    },
                    userHistory: {
                        address: rentHistory.address,
                        price: rentHistory.price,
                        day: rentHistory.day,
                        host: rentHistory.host
                    }    
                } 
            })
            .then(response => {
                
            })
            .catch(error => res.json(error))
          
        //////////

            Host.updateOne({
                _id: roomId
            }, {  $push: {
                    usersYes: {
                        day: date,
                        user: userId,
                        userName,
                        images
                    }    
                } 
            })
            .then(response => {
                res.json(response)
            })
            .catch(error => res.json(error))

        }

})


router.put('/rent/add/:id', auth, async (req, res) => {
    
    try {
    const { roomId, date } = req.body
    const userId = req.user
    const cancelUsersRoom = {userBooked: { [date] : roomId}, userHistory: {day: date}}
    const cancelRoomsUser = {usersYes: { day: date, user: userId}}
        await Host.updateOne({_id: roomId},{$pull: cancelRoomsUser})
        .then(() => {
            return User.updateOne({_id: userId}, {$pull: cancelUsersRoom})
            .then(async (e) => await res.status(200).send(e))
            
        })
        
    
    } catch (error) {
        console.log(error)
    }
})


router.get('/rent', async (req, res) => {
    const userId = req.query.user
    const date = req.query.date
    let maxDistance = (100/3963)
    let sacramento = ['-121.478851', '38.575764']
    let coords = await req.query.coords


    const queryStay = {"usersYes": {$elemMatch: { "day": date, "user": userId}}}
    const alreadyHosted = await Host.findOne(queryStay)
    
    if (alreadyHosted) {
        
        res.send({hosted: true,
            alreadyHosted: [alreadyHosted]
        })
    } else {
        
        Host.find({
            $and: [ {
            "loc.coordinates": {
                $geoWithin: {
                        $centerSphere: [ sacramento, maxDistance ]     
                    }
                }
        }, {
            "usersNo": {
                "$ne": {[date] : userId}
            },
            "active": {
                "$ne": false
            },
            }, 
            {startDate:{$lte:new Date()}},{endDate:{$gte:new Date()}}
            ] } )
        .then(async response => {       
            res.send(await response)       
            })
        .catch(error => res.json(error))
        }
})

router.post('/rent/:id', auth, async (req, res) => {
    
    const userSaysNo = req.user
    const userSaysNoDay = req.body.day
    const placeDenied = req.params.id
    await Host.updateOne({
        _id: placeDenied
    }, {$addToSet: { "usersNo": {[userSaysNoDay]: userSaysNo}}})
    .then(response => {    
        res.json(response)
    })
    .catch(error => res.json(error))
})


module.exports = router