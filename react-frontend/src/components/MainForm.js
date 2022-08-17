import React, { useState, useEffect } from 'react';
//COMPONENTS
import Loader from './Loader';
import DisplayGraph from './DisplayGraph';
import CreateGraph from './CreateGraph';
//APPSYNC-QUERIES
import { fetchAllGraphs } from '../appsync/queries';
//APPSYNC-SUBSCRIPTIONS
import { subscribeOnGraph } from '../appsync/subscriptions';
//REACT-SELECT
import Select from 'react-select';


function MainForm() {
    const [step, setStep] = useState(1);


    const [filterID, setFilterID] = useState("");
    const [clicked, setClicked] = useState(false);


    //fetching data from APPSYNC
    const [allGraphs, setAllGraphs] = useState(false);
    useEffect(() => {
        const fetchFunction = async () => {
            setAllGraphs(await fetchAllGraphs());
        }

        //fetching for first time
        fetchFunction();

        //'subscription' for first time
        subscribeOnGraph(fetchFunction);
    }, []);
    //fetching data from APPSYNC


    if (allGraphs === false) {
        return <Loader />;
    }
    else if (allGraphs === null) {
        return <h1> Error . . . </h1>;
    }


    if (step === 2) {
        return <DisplayGraph id={filterID} />;
    }
    else if (step === 3) {
        return <CreateGraph setStep={setStep} />;
    }


    return (
        <div className="app">
            <h1> Graph Diagram </h1>

            <form
                autoComplete="off"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setClicked(true);

                    if (filterID !== "" && clicked) {
                        setStep(2);
                    }
                }}
            >
                <div className="form-group flex flex-column">
                    <label> NAME  -  ID </label>
                    <Select
                        options={
                            allGraphs
                                .map((item) => {
                                    return {
                                        ...item,
                                        value: `${item.name}  -  ${item.id}`,
                                        label: `${item.name}  -  ${item.id}`
                                    }
                                })
                        }
                        className="basic-single w-full mt-8"
                        classNamePrefix="select"
                        onChange={(e) => setFilterID(e?.id)}
                        isClearable={true}
                    />
                    {filterID === "" && clicked && <p className="err"> Required Field </p>}
                </div>

                <button type='submit' className="btn btn-danger btn-block shadow-none">
                    SUBMIT ID
                </button>

                <button onClick={() => setStep(3)} className="btn btn-danger btn-block shadow-none">
                    CREATE GRAPH
                </button>
            </form>
        </div>
    )
}

export default MainForm;