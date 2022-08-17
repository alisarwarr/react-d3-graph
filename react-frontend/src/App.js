import React, { useState } from 'react';
//COMPONENTS
import Loader from './components/Loader';
import MainForm from './components/MainForm';
//ALERTi
import { successAlert, errorAlert } from './alert';
//AWS-AMPLIFY
import { Auth } from 'aws-amplify';


function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);


    const [isSingedIn, setIsSingedIn] = useState(false);


    if (loading) {
        return <Loader />;
    }
    else if (isSingedIn) {
        return <MainForm />;
    }


    return (
        <div className="app">
            <h1> SIGNIN FORM </h1>

            <form
                autoComplete="off"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setClicked(true);

                    if(email!=="" && password!=="" && clicked) {
                        setLoading(true);           /* loader on */

                        setTimeout(async() => {
                            try {
                                //calling functions after 1.5 secs
                                await Auth.signIn(
                                    email,
                                    password
                                );
                                console.log('successfully, SignedIn');
                                successAlert("successfully, SignedIn");
                                setIsSingedIn(true);
                            }
                            catch(error) {
                                console.log('error SignedIn', error);
                                errorAlert('SignIn', error.message);
                            }
                        }, 1500);

                        setLoading(false);      /* loader off */
                    }
                }}
            >
                <div className="form-group flex flex-column">
                    <div>
                        <label> EMAIL </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            placeholder="Email"
                            className="form-control"
                        />
                    </div>
                    {email==="" && clicked && <p className="err"> Required Field </p>}

                    <div className="mt-2">
                        <label> PASSWORD </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="form-control"
                        />
                    </div>
                    {password==="" && clicked && <p className="err"> Required Field </p>}
                </div>

                <button type='submit' className="btn btn-danger btn-block shadow-none">
                    SUBMIT
                </button>
            </form>
        </div>
    )
}

export default App;