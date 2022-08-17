import React, { useState } from 'react';
//COMPONENTS
import Loader from './Loader';
//ALERT
import { successAlert } from '../alert';
//APPSYNC-MUTATIONS
import { handleCreateGraph } from '../appsync/mutations';


function CreateGraph({ setStep }) {
    const [loading, setLoading] = useState(false);


    const [name, setName] = useState("");
    const [clicked, setClicked] = useState(false);


    if (loading) {
        return <Loader />;
    }


    return (
        <div className="app">
            <h1> Create Graph </h1>

            <form
                autoComplete="off"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setClicked(true);

                    if (name !== "" && clicked) {
                        setLoading(true);           /* loader on */

                        setTimeout(() => {
                            //calling functions after 1.5 secs
                            handleCreateGraph(name);

                            setLoading(false);      /* loader off */

                            //navigate back to page
                            setStep(1);

                            successAlert("successfully, Graph Created");
                        }, 1500);
                    }
                }}
            >
                <div className="form-group flex flex-column">
                    <div>
                        <label> NAME </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter name of your Graph . . ."
                            className="form-control"
                        />
                    </div>
                    {name === "" && clicked && <p className="err"> Required Field </p>}
                </div>

                <button type='submit' className="btn btn-danger btn-block shadow-none">
                    CREATE NOW
                </button>

                <button onClick={() => setStep(1)} className="btn btn-danger btn-block shadow-none">
                    GRAPH DIAGRAM
                </button>
            </form>
        </div>
    )
}

export default CreateGraph;