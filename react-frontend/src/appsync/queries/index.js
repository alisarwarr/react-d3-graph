//AWS-AMPLIFY
import { API } from 'aws-amplify';


import {
    allGraphs,
    getGraphByID
} from '../../graphql/queries';


export const fetchAllGraphs = async() => {
    const { data } = await API.graphql({
        query: allGraphs
    });
    return data.allGraphs;
}


export const fetchGetGraphByID = async(id) => {
    const { data } = await API.graphql({
        query: getGraphByID,
        variables: {
            id
        }
    });
    return data.getGraphByID;
}