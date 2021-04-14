import React from 'react';
import {BrowserRouter,Route, Switch} from 'react-router-dom';
import Auth from './Components/Auth/Auth'
import Otp from './Components/Otp/Otp'
import Home from './Components/Home/Home'
import CheckOtp from './Components/Reset-otp/ResetOtp'
import CheckResetOtp from './Components/Reset-otp/CheckResetOtp/CheckOtp'
import ResetPassword from './Components/Reset-otp/NewPassword/ResetPassword'
import './App.css'


function App() {
  return (
    <BrowserRouter>
    <Switch>
       <Route path="/" exact component={Auth}/>
       <Route path="/otp-check" component={Otp}/>
       <Route path="/home" component={ Home } />
       <Route path="/reset-email" component={CheckOtp} />
       <Route path="/check-resetotp" component={CheckResetOtp} />
       <Route path="/reset-password" component={ResetPassword} />
       
    </Switch>
    </BrowserRouter>
  );
}

export default App;
