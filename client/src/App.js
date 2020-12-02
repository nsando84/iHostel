import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Landing from './containers/Home/Landing/Landing';
import Navbar from './components/Navigation/Navbar'
import Host from './containers/Host/Host';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register'
import PrivateRoute from './components/Auth/Private'
import HostOptions from './containers/Host/HostOptions/HostOptions'
import Rent from './containers/Rent/Rent'
import Home from './containers/Home/Home'
import Options from './containers/Options/Options'
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { HostContextProvider } from './contexts/HostContext';
import UserContext from './contexts/UserContext';
import HostContext from './contexts/HostContext'


function App() {


  
  // const { host, setHost } = useContext(HostContext)
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  })

  const [host, setHost] = useState({
    active: null,
    capacity: null,
    userId: null,
    price: null,
    description: null,
    title: null,
    address: {
        addressOne: null,
        addressTwo: '',
        city: null,
        state: null,
        zip: null
    },
    images: [],
    dates: [],
})

      useEffect(() => {
          checkLoggedIn()
      }, []);

      const checkLoggedIn = async () => {

        try {
          let token = localStorage.getItem('auth-token');
          if (token == null) {
              localStorage.setItem('auth-token', '')
              token = ''
          }

          const tokenRes = await axios.post(
            'http://localhost:5000/users/tokenIsValid', 
            null,
            { headers: {
                'x-auth-token': token
            }})

            if (tokenRes.data) {
                const userRes = await axios.get(
                    'http://localhost:5000/users/', 
                    { headers: {
                        'x-auth-token': token
                    }}
                    );
       
                (async () => {
                  await setUserData({
                    token,
                    user: userRes.data
                    })

                  const hostData = await axios({
                      method: 'GET',
                      url: `http://localhost:5000/users/host/${userRes.data.id}`,
                      headers: {
                          'x-auth-token': token
                      }     
                  })

                  if (!hostData.data.data) {
                      
                  } else {

                  setHost({
                      active: hostData.data.data.active,
                      capacity: hostData.data.data.capacity,
                      userId: hostData.data.data.userId,
                      price: hostData.data.data.price,
                      description: hostData.data.data.description,
                      title: hostData.data.data.title,
                      address: {
                        addressOne: hostData.data.data.address.addressOne,
                        addressTwo: hostData.data.data.address.addressTwo,
                        state: hostData.data.data.address.state,
                        city: hostData.data.data.address.city,
                        zip: hostData.data.data.address.zip
                      },
                      images: hostData.data.data.images,
                      dates: hostData.data.data.range,
                  })
                    
                }
              })()
            }  
        } catch (err) {
          console.log(err)
        }          
    };

    console.log(host)
  return (
   <BrowserRouter>
      <UserContext.Provider value={{userData, setUserData}}>
      <HostContext.Provider value={{host, setHost}}>
          <Navbar />
          <Switch>
            <Route exact path='/host' component={Host}> 
                
                  <PrivateRoute
                    component={host.userId ? HostOptions : Host}
                    loggedIn={userData}
                  />
                
            </Route>
            <Route exact path='/rent'>

                  <PrivateRoute
                    component={Rent}
                    loggedIn={userData}
                  />       
                  
            </Route>



            <Route exact path='/options'>

                  <PrivateRoute
                    component={Options}
                    loggedIn={userData}
                  />       
                  
            </Route>
           
            
             
              <Route exact path='/login'>
              {userData.user ? <Redirect to="/" /> :
                <Login /> }
              </Route>
              
              
              <Route exact path='/login'>
              {userData.user ? <Redirect to="/" /> :
                <Register /> }
              </Route>
              
  
            <Route path='/' component={userData.user ? Home : Landing} /> 
            

            </Switch>
        </HostContext.Provider> 
      </UserContext.Provider>
   </BrowserRouter>
  );
}

export default App;
