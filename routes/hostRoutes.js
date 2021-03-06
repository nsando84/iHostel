const router = require('express').Router();
const auth = require('../auth/auth');
const Host = require('../models/hostModel')


router.post('/host', auth, async (req, res) => {
    const hostToDb =  new Host(req.body)
    await hostToDb.save()
    .then(response => {
        res.send(response)
    })
    .catch(error => {
        console.log(error)
    })

})

router.get('/host/:id', auth, async (req,res) => {
    const pullHostInfo = req.params.id
    const hostInfo = await Host.findOne({userId: pullHostInfo}) 
    res.send({
        hosting: hostInfo !== null,
        data: hostInfo     
    }) 
})
 

router.put('/host/:id', auth, async (req, res) => {
    let insert;
    if (req.body.genInfo) {
        insert = {title: req.body.genInfo.title, description: req.body.genInfo.description} 
    } else if (req.body.updateImages) {
        insert = {images: req.body.updateImages.images}
    } else if (req.body.updateRange) {
        // insert = {range: req.body.updateRange}
        insert = {startDate: req.body.updateRange.startDate, endDate: req.body.updateRange.endDate}
    } else if (req.body.active) {
        insert = {active: req.body.active.active}
    }
    const updateHostInfo = await Host.findByIdAndUpdate({_id: req.params.id}, insert)
    res.send(updateHostInfo)

})

router.get('/hostglance/:id', auth, async (req,res) => {

    const findGlance = await Host.find({_id: req.params.id}, "usersYes")  
    const yesArray = []
    const todayArray = []
    const { usersYes } = findGlance[0]
    for (const key in usersYes) {
       if (usersYes[key].day === req.query.day) {
            todayArray.push(usersYes[key]) 
       } else {
            yesArray.push(usersYes[key]) 
       }
           
    }
    res.send([todayArray, yesArray]) 
})




module.exports = router